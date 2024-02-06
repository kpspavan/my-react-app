import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Popconfirm,
  Form,
  Typography,
  notification,
  Spin,
  Button,
} from "antd";
import axios from "../../util/api";
import { EditOutlined, DeleteTwoTone } from "@ant-design/icons";
import EditableTableCell from "../adminui/Editabelcell/Editabelcell";
import { GET_DATA_URL } from "../../constants";

const { Search } = Input;

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedData, setSelectedData] = useState([]);

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const removeId = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const removeSelected = () => {
    const idArray = selectedData.map((e) => e.id);
    const updatedData = data.filter((item) => !idArray.includes(item.id));
    setData(updatedData);
    setSelectedData([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: dataList } = await axios.get(GET_DATA_URL);
        const formattedData = dataList.map((item) => ({
          ...item,
          key: item.id,
        }));
        setData(formattedData);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.error(e);
        openNotificationWithIcon("error", e.message);
      }
    };

    fetchData();
  }, []);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = data.map((item) =>
        item.key === key ? { ...item, ...row } : item
      );
      setData(newData);
      setEditingKey("");
    } catch (errInfo) {
      console.error("Validate Failed:", errInfo);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", width: "30%", editable: true },
    { title: "Email", dataIndex: "email", width: "30%", editable: true },
    { title: "Role", dataIndex: "role", width: "30%", editable: true },
    {
      title: "operation",
      dataIndex: "operation",
      className: "operation",
      width: "50%",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            {editable ? (
              <span>
                <a
                  href="/#"
                  onClick={() => save(record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </a>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a href="/#">Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                <EditOutlined />
              </Typography.Link>
            )}
            <div className="delete-btn">
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => removeId(record.id)}
              >
                <DeleteTwoTone twoToneColor="#eb2f96" />
              </Typography.Link>
            </div>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        "selectedRowKeys:",
        selectedRowKeys,
        "selectedRows:",
        selectedRows
      );
      setSelectedData(selectedRows);
    },
  };

  const onSearchChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <>
      <Search
        placeholder="Search by name, email or role"
        onChange={onSearchChange}
        enterButton
      />
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableTableCell,
            },
          }}
          rowSelection={{
            ...rowSelection,
          }}
          bordered
          dataSource={data.filter((item) =>
            Object.keys(item).some((key) =>
              item[key].toLowerCase().includes(filter)
            )
          )}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      {selectedData.length > 0 && (
        <Button
          type="primary"
          danger
          className="delete-selected-btn"
          onClick={removeSelected}
        >
          Delete Selected
        </Button>
      )}
      <style jsx>{`
        .ant-table-pagination.ant-table-pagination-right {
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default EditableTable;
