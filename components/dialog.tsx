import * as D from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";
import { Button, Form } from ".";

type DialogProps = {
  buttonLabel: string;
  submitLabel?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement> | undefined;
  title: string;
  description: string;
};

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  buttonLabel,
  submitLabel = "Submit",
  onSubmit,
  title,
  description,
  children,
}) => {
  return (
    <D.Root open={true}>
      <D.Trigger asChild>
        <Button>{buttonLabel}</Button>
      </D.Trigger>
      <D.Portal>
        <D.Overlay className="bg-black/50 fixed inset-0" />
        <D.Content className="bg-white border fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[450px]">
          <Form onSubmit={onSubmit}>
            <D.Title>{title}</D.Title>
            <D.Description className="opacity-50">
              <small>{description}</small>
            </D.Description>

            {children}

            <D.Close asChild>
              <Button type="submit">{submitLabel}</Button>
            </D.Close>
          </Form>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
};
