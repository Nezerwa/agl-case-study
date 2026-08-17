import Head from "next/head";
import type { GetStaticProps } from "next";
import type { CmsLayout } from "@agl/cms-types";
import { getLayout, isRouteFound } from "@/cms/actions/layout.action";
import { CmsPlaceholder } from "@/cms/renderer/CmsPlaceholder/CmsPlaceholder";

interface ContactPageProps {
  layout: CmsLayout;
}

export default function ContactPage({ layout }: ContactPageProps) {
  const { route } = layout.sitecore;

  if (!route) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{route.displayName ?? route.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CmsPlaceholder name="main" placeholders={route.placeholders} />
    </>
  );
}

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  const layout = await getLayout("contact");

  if (!isRouteFound(layout)) {
    return { notFound: true };
  }

  return { props: { layout } };
};
