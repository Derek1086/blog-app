import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const CustomSelect = ({ filter, handleFilter, filters }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel color="secondary" id="demo-select-small-label">
        Sort
      </InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={filter}
        label="Filter"
        onChange={handleFilter}
        color="secondary"
      >
        {filters.map((filterOption) => (
          <MenuItem key={filterOption.value} value={filterOption.value}>
            {filterOption.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
