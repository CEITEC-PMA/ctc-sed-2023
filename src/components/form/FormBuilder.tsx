import { Button, Container, Grid } from "@mui/material";
import React from "react";
import { RegisterDTO } from "@/utils/dtos/registerDTOs";
import TextInput from "../inputs/TextInput";
import {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  useForm,
} from "react-hook-form";
import { CandidatoInputs } from "../register/CandidatoRegister";
import EmailInput from "../inputs/EmailInput";
import CpfInput from "../inputs/CpfInput";
import DateInput from "../inputs/DateInput";
import FoneInput from "../inputs/FoneInput";
import SelectInput from "../inputs/SelectInput";
// import useTimeCheck from "@/hooks/useTimeCheck";

interface FormBuilderDTO {
  formDTOs: any[];
  onSubmit: SubmitHandler<any>;
  control: Control<any>;
  handleSubmit: UseFormHandleSubmit<any, undefined>;
  errors: FieldErrors<any>;
}

export default function FormBuilder({
  formBuilderDTO,
}: {
  formBuilderDTO: FormBuilderDTO;
}) {
  const { control, errors, handleSubmit, onSubmit, formDTOs } = formBuilderDTO;
  const renderInput = (dto: RegisterDTO) => {
    switch (dto.input) {
      case "text":
        return <TextInput control={control} errors={errors} inputDTO={dto} />;
      case "email":
        return <EmailInput control={control} errors={errors} inputDTO={dto} />;
      case "cpf":
        return <CpfInput control={control} errors={errors} inputDTO={dto} />;
      case "date":
        return <DateInput control={control} errors={errors} inputDTO={dto} />;
      case "fone":
        return <FoneInput control={control} errors={errors} inputDTO={dto} />;
      case "select":
        return <SelectInput control={control} errors={errors} inputDTO={dto} />;
      default:
        return <p>Erro Gerando Input</p>;
    }
  };

  // const isBeforeDeadline = useTimeCheck();

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center">
          {formDTOs.map((dto, i) => (
            <Grid item xs={12} sm={12} key={i}>
              {renderInput(dto)}
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button
              // disabled={!isBeforeDeadline}
              type="submit"
              variant="contained"
              style={{ margin: "12px" }}
            >
              Enviar formulário
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
