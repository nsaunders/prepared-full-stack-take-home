require "rails_helper"

RSpec.describe "Mutations::ChangeChatroomDescription", type: :request do
  let(:chatroom) { create(:chatroom) }
  
  let(:id) { chatroom.id }
  let(:description) { "Updated chatroom description" }
  let(:variables) do
    {
      id:,
      description:,
    }.to_json
  end
  
  let(:query) do
    <<~GQL
      mutation ChangeChatroomDescription(
        $id: ID!
        $description: String!
      ) {
        changeChatroomDescription(
          input: {
            id: $id
            description: $description
          }
        ) {
          chatroom {
            id
            description
          }
        }
      }
    GQL
  end

  it "changes the description of an existing chatroom" do
    post '/graphql', params: { query:, variables: }

    response_json = JSON.parse(response.body)

    updated_chatroom = Chatroom.find(id)

    expect(updated_chatroom.description).to eq(description)
  end

  context "when description is an empty string" do
    let(:description) { "" }

    it "normalizes the description as nil" do
      post '/graphql', params: { query:, variables: }

      updated_chatroom = Chatroom.find(id)

      expect(updated_chatroom.description).to be_nil
    end
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