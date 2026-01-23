import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, App } from "antd";
import { Music, ArrowLeft, Mail, Lock, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, clearError } from "@/store/slices/authSlice";

const { Title, Text, Paragraph } = Typography;

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { message } = App.useApp();

  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    dispatch(clearError());

    try {
      await dispatch(login({ email, password })).unwrap();
      message.success("Welcome back!");
      navigate("/");
    } catch (err) {
      message.error(error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Back button */}
        <Button 
          type="text" 
          onClick={() => navigate("/")}
          className="!text-muted-foreground hover:!text-foreground mb-6 !pl-0"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl btn-gradient flex items-center justify-center glow">
              <Music className="w-7 h-7 text-white" />
            </div>
          </div>
          <Title level={2} className="!text-gradient !mb-2">Now Music</Title>
          <Title level={4} className="!text-foreground !mb-1 !font-semibold">Welcome back</Title>
          <Text type="secondary">Sign in to continue sharing music</Text>
        </div>

        {/* Form */}
        <div className="glass-strong rounded-2xl p-6 shadow-xl">
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label={<span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>}>
              <Input
                size="large"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="!bg-secondary/50"
              />
            </Form.Item>

            <Form.Item label={<span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password</span>}>
              <Input.Password
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="!bg-secondary/50"
              />
            </Form.Item>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-4">
                <Text type="danger" className="text-sm">{error}</Text>
              </div>
            )}

            <Form.Item className="!mb-0">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={isLoading}
                block
                className="!h-12 btn-gradient !border-0"
                icon={!isLoading && <LogIn className="w-4 h-4" />}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </Form>

          <div className="mt-6 text-center">
            <Text type="secondary">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;