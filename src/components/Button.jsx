import RBButton from "react-bootstrap/Button";

export default function Button({ children, ...props }) {
  return (
    <RBButton variant="primary" {...props}>
      {children}
    </RBButton>
  );
}
