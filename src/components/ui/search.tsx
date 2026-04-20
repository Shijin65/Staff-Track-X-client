import { styled } from "@mui/material/styles";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import { IconButton, InputAdornment } from "@mui/material";
import { Close, Search as SearchIcon } from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "100px",
  backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "#e2e8f0",
  transition: "all 0.2s ease-in-out",
  display: "flex",
  alignItems: "center",
  paddingLeft: "12px",
  paddingRight: "4px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "#f8fafc",
    borderColor: theme.palette.primary.main,
  },
  "&:focus-within": {
    backgroundColor: "#ffffff",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(var(--primary-rgb), 0.2)" : "rgba(var(--primary-rgb), 0.1)"}`,
  },
}));

const StyledInputBase = styled(InputBase)<{ fullWidth?: boolean }>(({ theme, fullWidth }) => ({
  transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  color: theme.palette.mode === "dark" ? "white" : "#4b5563",
  marginLeft: 5,
  width: "100%",
  minWidth: "100px",
  flexGrow: fullWidth ? 1 : 0,
  "& .MuiInputBase-input": {
    width: "100%",
    padding: 0,
    fontSize: 14,
  },
  "& ::placeholder": {
    color: theme.palette.mode === "dark" ? "white" : "#000",
  },
}));

interface SearchInputProps extends Omit<InputBaseProps, 'value' | 'onChange' | 'onSelect'> {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  maxLength?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  setValue,
  placeholder = "Search",
  fullWidth,
  maxLength,
  ...rest
}) => {
  return (
    <Search>
      <StyledInputBase
        value={value}
        onChange={(e) => {
          const valueLimited = maxLength
            ? e.target.value.slice(0, maxLength)
            : e.target.value;
          setValue(valueLimited);
        }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        endAdornment={
          <InputAdornment position="start">
            <IconButton
              aria-label="search adornment"
              size="small"
              onClick={() => setValue("")}
              sx={{ p: "7px !important" }}
            >
              {!value ? (
                <SearchIcon className="w-5 h-5 text-ash" />
              ) : (
                <Close className="w-5 h-5 text-ash" />
              )}
            </IconButton>
          </InputAdornment>
        }
        fullWidth={fullWidth}
        {...rest}
      />
    </Search>
  );
};
