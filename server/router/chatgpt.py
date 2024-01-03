from openai import OpenAI

client = OpenAI(
    api_key="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",
)


def main(text):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": text
                + "\n"
                + 'Print the seller, buyer, sale price, land description and other covenants of this property and land plan book and page that is placed after "in Plan Book" and prior deed book and page that is placed after "For title" from above text as json(keys are: seller, buyer, sale_price, land_description, other_covenants, land_plan_book, land_plan_page, prior_deed_book, prior_deed_page). so the result format is "key": "value". the value of land_plan and prior_deed should be only number. land description and other covenants should contain all info',
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
            template_dict[key.strip().replace('"', "")] = value.strip().replace('"', "")
        except Exception as e:
            print(e)

    return template_dict.values()
