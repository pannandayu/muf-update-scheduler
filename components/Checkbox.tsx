import { ChangeEvent } from "react";

const Checkbox: React.FC<{
  name: string;
  id: string;
  value: string;
  children: string;
  changeHandler?: (event: ChangeEvent<HTMLInputElement>) => void;
}> = ({ name, id, value, children, changeHandler }) => {
  return (
    <div>
      <input
        type="checkbox"
        name={name}
        id={id}
        value={value}
        onChange={changeHandler}
      />
      <label htmlFor={name}>{children}</label>
    </div>
  );
};

export default Checkbox;
