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
                + 'Print the seller, buyer, sale price, land description and other covenants of this property from above text as json(keys are: seller, buyer, sale_price, land_description, other_covenants). so the result format is "key": "value". land description should contain all info as well as other covenants',
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
    pairs = response.split('",\n')

    template_dict = {}
    for pair in pairs:
        try:
            key, value = pair.split('": ')
            template_dict[key.strip()] = value.strip().replace('"', "")
        except Exception as e:
            print(e)

    return template_dict.values()
