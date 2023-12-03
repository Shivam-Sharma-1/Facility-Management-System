import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import ErrorComponent from "../components/Error";

const SetUser = () => {
  const [params] = useSearchParams();
  const auth = useAuth();
  const navigate = useNavigate();

  const { data, isError, error } = useQuery({
    queryKey: ["employee"],
    queryFn: async () => {
      const response = await axios.get<User>(
        `${import.meta.env.VITE_APP_SERVER_URL}/dashboard/employee/${params.get(
          "employeeId"
        )}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      auth?.login({
        name: data.name,
        employeeId: data.employeeId,
        image: data.image,
        role: data.role,
      });
      localStorage.setItem("token-info", JSON.stringify(data));
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isError) {
    const errorData = error.response!.data as ErrorMessage;
    return (
      <ErrorComponent
        status={errorData.error.status!}
        message={errorData.error.message}
      />
    );
  }
};

export default SetUser;
