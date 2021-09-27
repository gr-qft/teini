import { GetStaticProps } from "next";
import Link from "next/link";
import { PrismaClient, Prisma } from "@prisma/client";
import { useCartStore } from "../lib/cart";
import Layout from "../components/Layout";
import { styled, Box } from "../stitches.config";
import ProductCart from "../components/ProductCart";
import MenuBar from "../components/MenuBar";
import Button from "../components/Button";
import { ArrowRightIcon } from "@modulz/radix-icons";

const prisma = new PrismaClient();

const Headline = styled("h1", {
  fontFamily: "Work Sans, sans serif",
  fontSize: "32px",
  color: "$crimson12",
});

const Subheadline = styled("h1", {
  fontFamily: "Roboto, sans serif",
  fontSize: "18px",
  fontWeight: "normal",
  color: "$mauve9",
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  /**
   * Get all products with
   * availability !== notVisible
   */
  const allVisibleProducts = await prisma.product.findMany({
    where: {
      availability: {
        not: "notVisible",
      },
    },
  });

  return {
    props: {
      products: allVisibleProducts.map((product) => ({
        ...product,
        // Date objects needs to be converted to strings because the props object will be serialized as JSON
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString(),
      })),
    },
  };
};

const Home: React.FunctionComponent<{
  products: Required<Prisma.ProductUncheckedCreateInput>[];
}> = ({ products }) => {
  const { cart, addItem, removeItem, clearCart } = useCartStore();

  return (
    <MenuBar>
      <Box as="main" css={{ padding: "$2" }}>
        <Headline>Teini is the most smallest shop ever</Headline>
        <Subheadline>
          It gets you starting. Without budget. Without the ecommerce complexity
          you normally see.
        </Subheadline>
        <div>
          {products.map((product) => (
            <ProductCart key={product.id} product={product} />
          ))}
        </div>
        <Link href="/products" passHref>
          <Button
            as="a"
            css={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>See all products</span>
            <ArrowRightIcon />
          </Button>
        </Link>
      </Box>
    </MenuBar>
  );
};

// @ts-ignore
Home.layout = Layout;

export default Home;
