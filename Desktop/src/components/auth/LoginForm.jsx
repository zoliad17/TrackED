import React from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Form, message } from "antd";
import axios from "axios";

function LoginForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const baseURL = "http://127.0.0.1:8000";

  React.useEffect(() => {
    axios
      .get(`${baseURL}/verif`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async (values) => {
    const { email, password } = values;
    setIsLoading(true);

    try {
      // Create form data for token endpoint
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      // Get token from authentication endpoint
      const response = await axios.post(`${baseURL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.access_token) {
        // Store token and auth state
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("isAuthenticated", "true");

        // Decode token to get user info (JWT contains role)
        const tokenPayload = JSON.parse(
          atob(response.data.access_token.split(".")[1])
        );

        // Store user role from token
        localStorage.setItem("userRole", tokenPayload.roleType);
        localStorage.setItem("userId", tokenPayload.id);

        message.success("Login successful!");

        // Navigate based on role
        switch (tokenPayload.roleType) {
          case "admin":
            navigate("/admin");
            break;
          case "teacher":
            navigate("/home");
            break;
          case "student":
            navigate("/dashboard");
            break;
          default:
            message.error("Invalid role assigned to user");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Login failed. Please try again.";
      message.error(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">LOG-IN</h1>
        <Form onFinish={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                type="email"
                className="w-full py-2 border border-gray-300 rounded mt-2"
                placeholder="name@example.com"
              />
            </Form.Item>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                className="w-full py-2 border border-gray-300 rounded mt-2"
                placeholder="••••••"
              />
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full w-full py-2 rounded custom-maroon-button"
          >
            Sign In
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
