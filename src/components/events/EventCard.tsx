
import { Box, Chip, Typography, IconButton, Checkbox, Card } from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";
import { EventRow } from "./event-type";
import { DateBadge } from "../ui";


// Status mapping
const getStatusColor = (status: string): "success" | "error" | "primary" | "default" => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    case 'upcoming': return 'primary';
    default: return 'default';
  }
};



interface EventMobileCardProps {
  eventRow: EventRow;
  isSelectionMode: boolean;
  selected: string[];
  onSelect: (id: string, checked: boolean) => void;
  onViewDetails: (id: string) => void;
  onOpenModal: (event: React.MouseEvent<HTMLButtonElement>, type: string, id: string[]) => void;
  canDeleteEvent: boolean | undefined;
}

export const EventCard = ({
  eventRow,
  isSelectionMode,
  selected,
  onSelect,
  onViewDetails,
  onOpenModal,
  canDeleteEvent
}: EventMobileCardProps) => {
  const isChecked = selected.includes(eventRow.id);

  return (
    <Card
      onClick={() => onViewDetails(eventRow.id)}
      sx={{
        p: 0.5,
        display: "flex",
        alignItems: "center",
        gap: isSelectionMode ? 1 : 2,
        cursor: "pointer",
        borderRadius: 3,
        boxShadow: isChecked ? "0 4px 12px rgba(var(--primary-rgb), 0.15)" : "0 2px 10px rgba(0,0,0,0.04)",
        border: "1px solid",
        borderColor: isChecked ? "primary.main" : "divider",
        bgcolor: isChecked ? "rgba(25, 118, 210, 0.04)" : "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.main",
          bgcolor: isChecked ? "rgba(25, 118, 210, 0.08)" : "rgba(25, 118, 210, 0.02)",
        }
      }}
    >
      {canDeleteEvent && isSelectionMode && (
        <Checkbox
          size="small"
          checked={isChecked}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(eventRow.id, e.target.checked);
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{ p: 0.5 }}
        />
      )}

      <DateBadge dateStr={eventRow.eventDate} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {eventRow.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="flex" alignItems="center" gap={0.5}>
          {eventRow.eventVenue}
        </Typography>
      </Box>
<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: isSelectionMode ? 2 : 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, pr: isSelectionMode ? 2 : 0 }}>
        {eventRow.status && (
          <Chip
            size="small"
            label={eventRow.status}
            color={getStatusColor(eventRow.status)}
            sx={{ fontSize: "0.65rem", height: 20, textTransform: 'capitalize' }}
          />
        )}
        {eventRow.eventType && (
          <Chip
            size="small"
            label={eventRow.eventType}
            variant="outlined"
            sx={{ 
              fontSize: "0.6rem", 
              height: 18, 
              bgcolor: "rgba(var(--primary-rgb), 0.08)", 
              color: "primary.main",
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              borderColor: 'transparent'
            }}
          />
        )}
      </Box>
        {canDeleteEvent && !isSelectionMode && (
          <IconButton
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(e, "delete", [eventRow.id]);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Card>
  );
};