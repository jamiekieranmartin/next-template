import { SignIn, SignInProps } from "../../src/components/sign-in";

export default {
  title: "Components/Auth/SignIn",
  component: SignIn,
};

export const Default = (args: SignInProps) => <SignIn {...args} />;

export const WithLoading = (args: SignInProps) => <SignIn {...args} />;
WithLoading.args = {
  loading: true,
};

export const WithError = (args: SignInProps) => <SignIn {...args} />;
WithError.args = {
  error: "Uh oh! This was not meant to happen",
};
