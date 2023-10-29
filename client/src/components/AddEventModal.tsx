import React, { FC } from "react";
import { Box, Modal, TextField, Typography } from "@mui/material";

interface AddEventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AddEventModal: FC<AddEventModalProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="w-[400px] h-[400px] bg-bgPrimary text-black p-10 absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] rounded-sm">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          New event
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="flex flex-col gap-6"
        >
          <TextField
            id="filled-basic"
            label="Title"
            variant="filled"
            className="w-full"
          />
          <TextField
            id="filled-basic"
            label="Purpose"
            variant="filled"
            className="w-full"
          />
        </Box>
      </div>
    </Modal>
  );
};

export default AddEventModal;
