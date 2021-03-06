import { useState } from "react";
const useFormInput = (initialValue, validate) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setValue(e.target.value);
    setError(validate(e.target.value));
  };
  return {
    value,
    onChange: handleChange,
    error,
  };
};
export default useFormInput;
