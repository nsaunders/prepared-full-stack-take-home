require "rails_helper"

RSpec.describe "Mutations::ResolveChatroom", type: :request do
  let(:chatroom) { create(:chatroom) }
  
  let(:id) { chatroom.id }
  let(:variables) do
    {
      id:,
    }.to_json
  end
  
  let(:query) do
    <<~GQL
      mutation ResolveChatroom(
        $id: ID!
      ) {
        resolveChatroom(
          input: {
            id: $id
          }
        ) {
          chatroom {
            id
          }
        }
      }
    GQL
  end

  it "marks an existing chatroom as archived" do
    post '/graphql', params: { query:, variables: }

    response_json = JSON.parse(response.body)

    updated_chatroom = Chatroom.find(id)

    expect(updated_chatroom.resolved).to be true
  end

  context "when the chatroom id is not specified" do
    let(:id) { nil }

    it "returns an error" do
      post '/graphql', params: { query:, variables: }

      response_json = JSON.parse(response.body)
      expect(response_json["errors"].count).to be > 0
    end
  end
end