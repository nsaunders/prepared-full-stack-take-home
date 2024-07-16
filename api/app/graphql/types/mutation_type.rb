module Types
  class MutationType < Types::BaseObject
    field :change_chatroom_description, mutation: Mutations::ChangeChatroomDescription
    field :create_chatroom, mutation: Mutations::CreateChatroom
    field :resolve_chatroom, mutation: Mutations::ResolveChatroom
  end
end
