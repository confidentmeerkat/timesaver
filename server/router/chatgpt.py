from openai import OpenAI

client = OpenAI(
    api_key="sk-Z5Q.............jSE",
)


def main(text):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": text
                    + "\n"
                    + 'Print the seller, buyer, sale price, land description and other covenants of this property and land plan book and page that is placed after the context like "with the Barnstable County Registry of" and prior deed book and page that is placed after the context like "For title" from above text as json(keys are: seller, buyer, sale_price, land_description, other_covenants, land_plan_book, land_plan_page, prior_deed_book, prior_deed_page). total number of keys are 9. so the result format is "key": "value". the value of land_plan_book, land_plan_page, prior_deed_book and prior_deed_page should be only number. land description and other covenants should contain all info',
                }
            ],
            model="gpt-3.5-turbo",
        )
    except Exception as e:
        print(e)

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
