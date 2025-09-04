import Form from "react-bootstrap/Form";

export default function Input({ label, type = "text", ...props }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type={type} {...props} />
    </Form.Group>
  );
}
