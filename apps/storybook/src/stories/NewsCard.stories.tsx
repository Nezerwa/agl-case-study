import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsCard } from "@agl/ui";
import { newsArticles } from "../fixtures/news";

const [salon, gta] = newsArticles;

/**
 * One article. The category chip is the shared **Badge** (`solid` / `small`) and the
 * read-more control is the shared **ButtonLink** (`variant="link"`), so this component
 * owns no colour, radius or typography for either — only the card frame and the
 * position of the badge over the image.
 *
 * The card stretches to its grid row, with the link pinned to the bottom by
 * `margin-top: auto`. Compare **LongTitle** against **Event** in the NewsGrid stories
 * to see equal-height behaviour.
 *
 * The link reads "Lire la suite" but announces the article title to screen readers,
 * so six identical link names never appear in a links list.
 */
const meta = {
  title: "Modules/NewsCard",
  component: NewsCard,
  parameters: { layout: "centered" },
  args: { ...salon },
  argTypes: {
    image: { control: "object" },
    categoryLabel: { control: "text" },
    date: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    href: { control: "text" },
    readMoreLabel: { control: "text" },
    headingLevel: { control: "inline-radio", options: ["h2", "h3"] },
    linkComponent: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "376px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An Événements article, at the Figma card width of 376px. */
export const Event: Story = {};

/** A Presse article — same component, different content. */
export const Press: Story = {
  args: { ...gta },
};

/**
 * The longest real title in the set. Nothing is truncated: the card grows, and in a
 * grid the row grows with it so the bottoms stay aligned.
 */
export const LongTitle: Story = {
  args: { ...newsArticles[5] },
};

/** With no description authored, the link still sits at the bottom of the card. */
export const WithoutDescription: Story = {
  args: { description: "" },
};
