import { Prisma } from "@prisma/client";

export const cartItemToLineItem = (
  cartItem: Required<Prisma.ProductUncheckedCreateInput & { count: number }>
) => {
  return {
    price_data: {
      currency: "usd", //ISO Code https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
      unit_amount_decimal: 299, // cartItem.price,
      product_data: {
        name: cartItem.name,
        description: cartItem.description,
        images: ["urlToImage"],
        // meta: { key: "value" },
        // tax_code: "dqwd", // https://stripe.com/docs/tax/tax-codes
      },
    },
    adjustable_quantity: {
      enabled: true,
    },
    // dynamic_tax_rates
    quantity: cartItem.count,
  };
};

/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};