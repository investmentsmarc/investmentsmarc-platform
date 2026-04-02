export const PLATFORM_FLAGS = {
  firebaseAuthReady: Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ),
  stripeReady: Boolean(process.env.STRIPE_SECRET_KEY),
};
