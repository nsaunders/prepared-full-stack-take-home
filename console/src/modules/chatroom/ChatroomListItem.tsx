import {
  CheckBox,
  CheckBoxOutlineBlank,
  Edit,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
  Collapse,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";

import {
  ChatroomDataFragment,
  ChatroomsListDocument,
  useChangeChatroomDescriptionMutation,
} from "~src/codegen/graphql";
import { ChatroomTags } from "./ChatroomTags";

const ChatroomCard = styled(Card)<CardProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

export type ChatroomListItemProps = {
  chatroom: ChatroomDataFragment;
  onResolve(): void;
};

export const ChatroomListItem: React.FC<ChatroomListItemProps> = ({
  chatroom,
  onResolve,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [changeDescription, setChangeDescription] = useState(false);
  const [hoverResolve, setHoverResolve] = useState(false);

  const natureCodeName = chatroom.natureCode?.name ?? "Uncategorized";

  return (
    <ChatroomCard variant="outlined">
      <Box
        display="flex"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h6">{chatroom.label}</Typography>
          <ChatroomTags
            natureCode={natureCodeName}
            callerPhoneNumber={chatroom.callerPhoneNumber}
          />
        </Box>
        <IconButton onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>
      <Collapse in={showDetails}>
        <Card sx={{ padding: 2 }}>
          {changeDescription ? (
            <ChangeDescription
              values={chatroom}
              onComplete={() => {
                setChangeDescription(false);
              }}
            />
          ) : (
            <>
              <Typography variant="body1">Description</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                {chatroom.description ?? "No description provided."}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => {
                    setChangeDescription(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={
                    hoverResolve ? <CheckBox /> : <CheckBoxOutlineBlank />
                  }
                  onMouseEnter={() => {
                    setHoverResolve(true);
                  }}
                  onMouseLeave={() => {
                    setHoverResolve(false);
                  }}
                  onClick={() => {
                    onResolve();
                  }}
                >
                  Resolve
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Collapse>
    </ChatroomCard>
  );
};

function ChangeDescription({
  values,
  onComplete,
}: {
  values: Pick<ChatroomDataFragment, "id" | "description">;
  onComplete(): void;
}) {
  const [description, setDescription] = useState<string | null>(null);
  const [changeChatroomDescription, status] =
    useChangeChatroomDescriptionMutation({
      refetchQueries: [ChatroomsListDocument],
    });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await changeChatroomDescription({
          variables: {
            id: values.id,
            description: description || "",
          },
        });
        onComplete();
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          autoFocus
          size="small"
          label="Description"
          name="description"
          value={description ?? values.description}
          onFocus={(e) => {
            e.target.select();
          }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          rows={4}
          multiline
        />
        <Box display="flex" justifyContent="space-between" marginTop={4}>
          <Typography
            variant="body2"
            sx={{ color: status.error ? "error.main" : "inherit" }}
          >
            {status.loading
              ? "Please wait..."
              : status.error
              ? "An error has occurred. Please try again or contact us."
              : null}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="text"
              color="primary"
              disabled={status.loading}
              onClick={() => {
                onComplete();
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              color="primary"
              type="submit"
              disabled={description === null || status.loading}
              startIcon={
                status.loading ? (
                  <CircularProgress color="inherit" size="1em" />
                ) : null
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
}
