import { useState } from "react";

const useInput = (defaultValue: string) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = ({
    target,
  }: {
    target: HTMLInputElement | HTMLTextAreaElement;
  }) => {
    setValue(target.value);
  };

  return { value, setValue, onChange };
};

export default useInput;
