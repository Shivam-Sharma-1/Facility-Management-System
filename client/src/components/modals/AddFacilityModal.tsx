import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Button,
  Fade,
  FormControl,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

import "dayjs/locale/en-gb";

const AddFacilityModal: FC<AddFacilityModalProps> = ({
  isOpen,
  setIsOpen,
  setOpenSnackbar,
}): JSX.Element => {
  const [formData, setFormData] = useState<AddFacilityDataProps>({
    name: "",
    description: "",
    icon: "",
    FMId: "",
  });

  const mutation = useMutation({
    mutationFn: (data: AdminFacilitiesSubmitData) =>
      axios.post(`http://localhost:3000/admin/facility/add`, data, {
        withCredentials: true,
      }),
    onSuccess: () => {
      setIsOpen(false);
      setOpenSnackbar(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const submitData: AdminFacilitiesSubmitData = {
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      slug: formData.name.toLowerCase().replace(/\s/g, "-"),
      facilityManagerId: parseInt(formData.FMId! as string),
    };
    mutation.mutate(submitData);
  };

  const handleCancel = (): void => {
    setIsOpen(false);
    setFormData({
      name: "",
      description: "",
      icon: "",
      FMId: "",
    });
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Fade in={isOpen}>
        <div className="bg-bgPrimary w-full max-w-[500px] px-10 py-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-md flex flex-col gap-6 shadow-cardHover">
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Create new facility
          </Typography>
          <form
            autoComplete="off"
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <FormControl className="flex gap-4" size="small">
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                className="w-full"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                size="small"
              />
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                className="w-full"
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                size="small"
              />
              <TextField
                id="icon"
                label="Icon"
                variant="outlined"
                className="w-full"
                value={formData.icon}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                required
                size="small"
              />
              <TextField
                id="FMId"
                label="Facility Manager Id"
                variant="outlined"
                className="w-full"
                value={formData.FMId}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, FMId: e.target.value })
                }
                required
                size="small"
              />
            </FormControl>
            <div className="w-full flex items-center justify-between mt-2">
              <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{ minWidth: "47%" }}
                size="large"
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: "47%" }}
                size="large"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddFacilityModal;
