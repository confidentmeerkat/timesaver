from openai import OpenAI

client = OpenAI(
    api_key="sk-5QbLND............",
)


def main(text):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": text
                + "\n"
                + "Print the seller, buyer and sale price of this property from above text as json(keys are: 'seller, buyer and 'sale_price'')",
            }
        ],
        model="gpt-3.5-turbo",
    )

    response = (
        chat_completion.choices[0]
        .message.content.replace("{", "")
        .replace("}", "")
        .replace("'", "")
    )
    pairs = response.split('",')

    template_dict = {}
    for pair in pairs:
        key, value = pair.split(":")
        template_dict[key.strip()] = value.strip().replace('"', "")

    return template_dict.values()
