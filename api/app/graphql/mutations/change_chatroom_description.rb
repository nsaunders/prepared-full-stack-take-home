module Mutations
  class ChangeChatroomDescription < BaseMutation
    argument :id, ID, required: true
    argument :description, String, required: true

    # fields
    field :chatroom, Types::ChatroomType, null: false

    # resolver
    def resolve(id:, description:)
      chatroom = Chatroom.find(id)

      params = {
        description: description.blank? ? nil : description,
      }
      
      if chatroom.update(params)
        { chatroom: chatroom }
      else
        raise GraphQL::ExecutionError.new("Error changing chatroom description: #{chatroom.errors.full_messages.join(', ')}")
      end
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new("Chatroom not found: #{e.message}")
    end
  end
end