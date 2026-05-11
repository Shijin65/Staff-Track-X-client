
import { Box, Chip, Typography, IconButton, Checkbox, Card } from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";
import { EventRow } from "./event-type";


// Status mapping
const getStatusColor = (status: string): "success" | "error" | "primary" | "default" => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    case 'upcoming': return 'primary';
    default: return 'default';
  }
};

const renderDateBadge = (dateStr: string) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });

  // Check if event is today or past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(date);
  eventDate.setHours(0, 0, 0, 0);

  let isToday = false;
  let bgcolor = "rgba(var(--primary-rgb), 0.1)";
  let color = "primary.main";
  let border = "1px solid rgba(var(--primary-rgb), 0.2)";

  if (eventDate.getTime() === today.getTime()) {
    isToday = true;
    bgcolor = "primary.main";
    color = "primary.contrastText";
    border = "none";
  } else if (eventDate.getTime() < today.getTime()) {
    bgcolor = "rgba(0,0,0,0.05)";
    color = "text.secondary";
    border = "1px solid rgba(0,0,0,0.1)";
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor,
        color,
        border,
        borderRadius: 2,
        minWidth: 50,
        height: 56,
        boxShadow: isToday ? '0 4px 12px rgba(var(--primary-rgb), 0.3)' : 'none',
      }}>
        <Typography variant="h6" fontWeight={800} lineHeight={1}>{day}</Typography>
        <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>{month}</Typography>
      </Box>
      {isToday && (
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 14,
            height: 14,
            bgcolor: 'error.main',
            borderRadius: '50%',
            border: '2px solid',
            borderColor: 'background.paper',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
              '70%': { boxShadow: '0 0 0 6px rgba(239, 68, 68, 0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
            }
          }}
        />
      )}
    </Box>
  );
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

      {renderDateBadge(eventRow.eventDate)}

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {eventRow.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap display="flex" alignItems="center" gap={0.5}>
          {eventRow.eventVenue}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pr: isSelectionMode ? 2 : 0 }}>
        {eventRow.status && (
          <Chip
            size="small"
            label={eventRow.status}
            color={getStatusColor(eventRow.status)}
            sx={{ fontSize: "0.65rem", height: 20, textTransform: 'capitalize' }}
          />
        )}
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