import { FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Button, TextField } from "@mui/material";
import { useAuth } from "../components/hooks/useAuth";

const LoginPage: FC = (): JSX.Element => {
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.path || "/";

  const mutation = useMutation({
    mutationFn: (data: LoginData) =>
      axios.post("http://localhost:3000/auth/login", data, {
        withCredentials: true,
      }),
    onSuccess: (data) => {
      console.log(data);
      auth?.login(data.data);
      localStorage.setItem("token-info", JSON.stringify(data.data));
      navigate(redirectPath, { replace: true, preventScrollReset: true });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    console.log(id, password);
    mutation.mutate({ employeeId: id, password: password });
  };

  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center">
      <div className="w-[400px] bg-bgPrimary shadow-cardHover rounded-lg flex flex-col justify-center p-10 gap-6">
        <h1 className="text-black">Employee Login</h1>
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="flex flex-col gap-4"
        >
          <TextField
            id="id"
            label="Id"
            variant="outlined"
            className="w-full"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              minWidth: "40%",
              paddingBlock: "1em",
              marginTop: "1em",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
