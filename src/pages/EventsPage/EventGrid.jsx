import React from "react";
import { Box, Typography, Card, CardContent, Stack, Chip, CardActionArea } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from 'react-router-dom'; 

const EventGrid = ({ events }) => {
  // Optional: Add a check for no events, so the page isn't just blank
  if (!events || events.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          color: "#666",
        }}
      >
        <Typography variant="h6">
          No events to display at the moment. Check back soon!
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    return { month, day, weekday };
  };

  const formatTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Stack spacing={2}>
      {events.map((event) => {
        const { month, day, weekday } = formatDate(event.dateTime);
        const time = formatTime(event.dateTime);

        return (
          <Card
            key={event.id}
            elevation={1}
            sx={{
              borderRadius: "12px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                elevation: 3,
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              },
              cursor: "pointer",
            }}
          >
            <CardActionArea
              component={Link} 
              to={`/events/${event.eventId}`} 
              
            >
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    minHeight: "120px",
                  }}
                >
                  {/* Date Section - Left Side */}
                  <Box
                    sx={{
                      width: "100px",
                      backgroundColor: "#f8f9fa",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px 0 0 12px",
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {weekday}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#2E5BFF",
                        lineHeight: 1,
                        my: 0.5,
                      }}
                    >
                      {day}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#666",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {month}
                    </Typography>
                  </Box>

                  {/* Event Details - Right Side */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Top Section */}
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: "#1a1a1a",
                            lineHeight: 1.3,
                            flex: 1,
                            mr: 2,
                          }}
                        >
                          {event.title.length > 60
                            ? `${event.title.substring(0, 60)}...`
                            : event.title}
                        </Typography>
                        {/* Category Label */}
                        {event.category.toLowerCase() !== "none" && (
                          <Chip
                            label={event.category}
                            size="small"
                            sx={{
                              backgroundColor: "#E8F0FF",
                              color: "#2E5BFF",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          />
                        )}
                      </Box>
                      {/* Shortened Event description */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          mb: 2,
                          lineHeight: 1.5,
                        }}
                      >
                        {event.description.length>60
                        ?`${event.description.substring(0, 60)}...`
                        :event.description}
                      </Typography>
                    </Box>

                    {/* Bottom Section */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pt: 1,
                        borderTop: "1px solid #f0f0f0",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOnIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          {event.location}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#2E5BFF",
                          fontWeight: 600,
                        }}
                      >
                        {time}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Stack>
  );
};

export default EventGrid;
