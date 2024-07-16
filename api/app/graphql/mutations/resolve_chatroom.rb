module Mutations
  class ResolveChatroom < BaseMutation
    argument :id, ID, required: true

    # fields
    field :chatroom, Types::ChatroomType, null: false

    # resolver
    def resolve(id:)
      chatroom = Chatroom.find(id)

      params = {
        resolved: true
      }
      
      if chatroom.update(params)
        { chatroom: chatroom }
      else
        raise GraphQL::ExecutionError.new("Error resolving chatroom: #{chatroom.errors.full_messages.join(', ')}")
      end
    rescue ActiveRecord::RecordNotFound => e
      raise GraphQL::ExecutionError.new("Chatroom not found: #{e.message}")
    end
  end
end