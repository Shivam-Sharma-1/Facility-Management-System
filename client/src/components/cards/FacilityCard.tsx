import {
  Tooltip,
  TooltipProps,
  Typography,
  Zoom,
  styled,
  tooltipClasses,
} from "@mui/material";
import { FC } from "react";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#00275E",
    maxWidth: 220,
    border: "1px solid #dadde9",
  },
}));

const FacilityCard: FC<FacilityCardProps> = ({
  name,
  description,
  icon,
  manager,
}): JSX.Element => {
  return (
    <HtmlTooltip
      placement="top"
      arrow
      TransitionComponent={Zoom}
      title={
        <Typography
          variant="body1"
          component="h2"
          className="text-primary font-normal"
        >
          {description}
        </Typography>
      }
    >
      <div className="w-[200px] h-full min-h-[300px] gap-4 m-6 p-2 pt-4 border-0 border-b-4 border-solid border-primary flex flex-col  items-center shadow-card cursor-pointer rounded-md hover:-translate-y-1 hover:shadow-cardHover transition-all duration-150 ease-in">
        <img src={icon} alt={`${name}-icon`} className="w-[90%] object-cover" />
        <div className="w-full flex flex-col justify-center items-center gap-1">
          <Typography
            variant="h5"
            component="h2"
            className="text-primary font-normal text-center"
          >
            {name}
          </Typography>
          <Typography
            variant="body1"
            component="h2"
            className="text-primary font-normal"
          >
            FM - {manager}
          </Typography>
        </div>
      </div>
    </HtmlTooltip>
  );
};

export default FacilityCard;
