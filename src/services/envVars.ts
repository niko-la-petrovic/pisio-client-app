const API_URL = process.env.NEXT_PUBLIC_API_URL;

const envVars = {
  API_URL: {
    key: "NEXT_PUBLIC_API_URL",
    value: API_URL,
  },
};

Object.entries(envVars).forEach(([_, { key, value }]) => {
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
});

export default envVars;
