// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";

const submitMock = vi.hoisted(() => vi.fn());

vi.mock("@/features/contact/contactSubmission.service", () => ({
  submitContactForm: submitMock,
}));

const { default: handler, __rateLimiter } = await import("@/pages/api/contact");

const validBody = {
  fullName: "Aïcha O'Connor",
  phone: "+222 45 67 89 01",
  email: "aicha@example.com",
  company: "SOGECO",
  subject: "Demande de devis",
  message: "Bonjour, je souhaite un devis pour du transport multimodal.",
};

interface FakeRes {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  setHeader(key: string, value: string): FakeRes;
  status(code: number): FakeRes;
  json(payload: unknown): FakeRes;
}

function createRes(): FakeRes {
  return {
    statusCode: 0,
    headers: {},
    body: undefined,
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function createReq(overrides: Partial<NextApiRequest> = {}, ip = "203.0.113.1") {
  return {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      host: "localhost:3000",
      "x-forwarded-for": ip,
    },
    socket: { remoteAddress: ip },
    body: { ...validBody },
    ...overrides,
  } as unknown as NextApiRequest;
}

async function call(req: NextApiRequest) {
  const res = createRes();
  await handler(req, res as unknown as NextApiResponse);
  return res;
}

beforeEach(() => {
  __rateLimiter.reset();
  submitMock.mockReset();
  submitMock.mockResolvedValue({ referenceId: "AGL-TEST1234" });
});

describe("POST /api/contact — happy path", () => {
  it("accepts a valid submission and returns a reference", async () => {
    const res = await call(createReq());

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, referenceId: "AGL-TEST1234" });
  });

  it("hands the service normalised data, not the raw body", async () => {
    await call(
      createReq({
        body: { ...validBody, email: "  Aicha@Example.COM ", fullName: "  Aïcha  " },
      } as Partial<NextApiRequest>),
    );

    expect(submitMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "aicha@example.com", fullName: "Aïcha" }),
    );
  });

  it("never forwards the honeypot field to the service", async () => {
    await call(
      createReq({ body: { ...validBody, website: "" } } as Partial<NextApiRequest>),
    );

    expect(submitMock.mock.calls[0][0]).not.toHaveProperty("website");
  });
});

describe("POST /api/contact — method handling", () => {
  it.each(["GET", "PUT", "PATCH", "DELETE"])("rejects %s with 405", async (method) => {
    const res = await call(createReq({ method } as Partial<NextApiRequest>));

    expect(res.statusCode).toBe(405);
    expect(res.headers.Allow).toBe("POST");
    expect(res.body).toEqual({ success: false, error: "METHOD_NOT_ALLOWED" });
  });

  it("does not reach the submission service for a rejected method", async () => {
    await call(createReq({ method: "GET" } as Partial<NextApiRequest>));

    expect(submitMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — request shape", () => {
  it.each([[undefined], ["a string body"], [[1, 2, 3]], [42]])(
    "rejects a non-object body (%s)",
    async (body) => {
      const res = await call(createReq({ body } as Partial<NextApiRequest>));

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ success: false, error: "INVALID_REQUEST" });
    },
  );
});

describe("POST /api/contact — origin", () => {
  it("accepts a same-origin submission", async () => {
    expect((await call(createReq())).statusCode).toBe(200);
  });

  it("rejects a cross-site submission", async () => {
    const res = await call(
      createReq({
        headers: {
          origin: "https://evil.example.com",
          host: "localhost:3000",
          "x-forwarded-for": "203.0.113.2",
        },
      } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ success: false, error: "FORBIDDEN_ORIGIN" });
    expect(submitMock).not.toHaveBeenCalled();
  });

  it("accepts a request with no Origin, as documented", async () => {
    const res = await call(
      createReq({
        headers: { host: "localhost:3000", "x-forwarded-for": "203.0.113.3" },
      } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /api/contact — server validation is the trust boundary", () => {
  it("rejects an invalid email even though the client validated it", async () => {
    const res = await call(
      createReq({ body: { ...validBody, email: "not-an-email" } } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ success: false, error: "VALIDATION_ERROR" });
    expect(submitMock).not.toHaveBeenCalled();
  });

  it.each(["fullName", "phone", "email", "company", "message"])(
    "rejects an empty %s, which the CMS marks required",
    async (name) => {
      const res = await call(
        createReq({ body: { ...validBody, [name]: "" } } as Partial<NextApiRequest>),
      );

      expect(res.statusCode).toBe(400);
      expect(submitMock).not.toHaveBeenCalled();
    },
  );

  it("accepts an empty subject, which the CMS leaves optional", async () => {
    const res = await call(
      createReq({ body: { ...validBody, subject: "" } } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(200);
  });

  it("accepts a submission that omits the optional subject entirely", async () => {
    const { subject, ...withoutSubject } = validBody;

    expect(subject).toBeDefined();

    const res = await call(createReq({ body: withoutSubject } as Partial<NextApiRequest>));

    expect(res.statusCode).toBe(200);
  });

  /**
   * The field configuration is read server-side from the CMS. A caller who could supply
   * it would declare everything optional and walk past validation entirely.
   */
  it("ignores a field configuration supplied in the request body", async () => {
    const res = await call(
      createReq({
        body: {
          ...validBody,
          email: "",
          fields: [{ name: "email", label: "E-mail", type: "email", required: false }],
        },
      } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(400);
    expect(submitMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized message", async () => {
    const res = await call(
      createReq({
        body: { ...validBody, message: "x".repeat(5001) },
      } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(400);
  });

  it("returns one safe message per field, not the raw Zod tree", async () => {
    const res = await call(
      createReq({
        body: { ...validBody, email: "nope", fullName: "" },
      } as Partial<NextApiRequest>),
    );

    const body = res.body as { fieldErrors: Record<string, string> };

    expect(Object.keys(body.fieldErrors).sort()).toEqual(["email", "fullName"]);
    expect(typeof body.fieldErrors.email).toBe("string");
    expect(JSON.stringify(res.body)).not.toMatch(/ZodError|_zod|expected|received/i);
  });
});

describe("POST /api/contact — honeypot", () => {
  it("rejects a submission with the honeypot filled", async () => {
    const res = await call(
      createReq({
        body: { ...validBody, website: "http://spam.example" },
      } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(400);
    expect(submitMock).not.toHaveBeenCalled();
  });

  it("tells the bot nothing about why it was rejected", async () => {
    const res = await call(
      createReq({ body: { ...validBody, website: "spam" } } as Partial<NextApiRequest>),
    );

    expect(res.body).toEqual({ success: false, error: "INVALID_REQUEST" });
    expect(JSON.stringify(res.body)).not.toMatch(/honeypot|website|bot/i);
  });

  it("accepts an empty honeypot, which is what a real browser submits", async () => {
    const res = await call(
      createReq({ body: { ...validBody, website: "" } } as Partial<NextApiRequest>),
    );

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /api/contact — rate limiting", () => {
  it("allows the first five submissions and blocks the sixth", async () => {
    for (let i = 0; i < 5; i += 1) {
      expect((await call(createReq({}, "198.51.100.1"))).statusCode).toBe(200);
    }

    const blocked = await call(createReq({}, "198.51.100.1"));

    expect(blocked.statusCode).toBe(429);
    expect(blocked.body).toEqual({ success: false, error: "RATE_LIMITED" });
    expect(blocked.headers["Retry-After"]).toBeDefined();
  });

  it("limits per client, so one flooder does not block everyone", async () => {
    for (let i = 0; i < 5; i += 1) {
      await call(createReq({}, "198.51.100.2"));
    }

    expect((await call(createReq({}, "198.51.100.2"))).statusCode).toBe(429);
    expect((await call(createReq({}, "198.51.100.3"))).statusCode).toBe(200);
  });

  it("blocks before running validation or reaching the service", async () => {
    for (let i = 0; i < 5; i += 1) {
      await call(createReq({}, "198.51.100.4"));
    }
    submitMock.mockClear();

    const res = await call(
      createReq({ body: { ...validBody, email: "bad" } } as Partial<NextApiRequest>, "198.51.100.4"),
    );

    expect(res.statusCode).toBe(429);
    expect(submitMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — downstream failure", () => {
  it("returns a safe 500 when the service throws", async () => {
    submitMock.mockRejectedValue(
      new Error("SMTP 535 auth failed for user apikey@provider.internal"),
    );

    const res = await call(createReq());

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ success: false, error: "SUBMISSION_FAILED" });
  });

  it("leaks no stack, hostname or credential from the thrown error", async () => {
    submitMock.mockRejectedValue(
      new Error("connect ECONNREFUSED crm.internal.agl:5432 token=sk_live_abc"),
    );

    const res = await call(createReq());
    const serialized = JSON.stringify(res.body);

    expect(serialized).not.toMatch(/ECONNREFUSED|internal|sk_live|at Object|\.ts:/);
  });
});
