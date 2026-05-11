"use client";

import { styled } from "@mui/material/styles";
import InputBase, { InputBaseProps } from "@mui/material/InputBase";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconButton, InputAdornment } from "@mui/material";

const Search = styled("div")({
  position: "relative",
  borderRadius: 10,
  backgroundColor: "hsl(var(--ash-light, 214 32% 91%) / 0.60)",
  transition: "background-color ease 200ms",
  display: "flex",
  "&:hover": {
    backgroundColor: "hsl(var(--ash-light, 214 32% 91%) / 0.80)",
  },
  "&:focus-within": {
    backgroundColor: "hsl(var(--ash-light, 214 32% 91%) / 0.60)",
  },
});

const StyledInputBase = styled(InputBase)<{ fullWidth?: boolean }>(({ fullWidth }) => ({
  transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  color: "var(--text-primary)",
  marginLeft: 10,
  width: "100%",
  minWidth: "100px",
  flexGrow: fullWidth ? 1 : 0,
  "& .MuiInputBase-input": {
    width: "100%",
    padding: 0,
    fontSize: 16, // Changed to 16px to prevent iOS Safari auto-zoom on focus
  },

}));

interface SearchInputProps extends Omit<InputBaseProps, 'value' | 'onChange'> {
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
                <MagnifyingGlassIcon style={{ width: 20, height: 20 }} />
              ) : (
                <XMarkIcon style={{ width: 20, height: 20 }} />
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

