import { styled } from "@mui/material/styles";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import { IconButton, InputAdornment } from "@mui/material";
import { Close, Search as SearchIcon } from "@mui/icons-material";

const Search = styled("div")({
  position: "relative",
  borderRadius: 6,
  backgroundColor: "hsl(var(--ash-light)/0.15)",
  transition: "background-color ease 200ms",
  display: "flex",
  paddingRight: "0px",
  "&:hover": {
    backgroundColor: "hsl(var(--ash-light)/0.2)",
  },
  "&:focus-within": {
    backgroundColor: "hsl(var(--ash-light)/0.2)",
  },
});

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
