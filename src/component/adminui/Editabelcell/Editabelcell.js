import React from "react";
import { Input, InputNumber, Form } from "antd";

const EditableTableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  ...restProps
}) => {
  const renderInputNode = () => {
    if (inputType === "number") {
      return <InputNumber />;
    } else {
      return <Input />;
    }
  };

  return (
    <td {...restProps} style={{ width: "1 0%" }}>
      {" "}
      {/* Adjust the width as needed */}
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {renderInputNode()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableTableCell;
