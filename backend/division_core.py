import pandas as pd


def divide(configuration, file):
    df = pd.read_excel(file)
    # to send JSON response
    people = df.to_dict('records')
    df['project'] = ['' for i in range(len(df))]
    df['team'] = ['' for i in range(len(df))]

    soft_skills = set(map(lambda x: x.lower(), open('./dataset/soft_skills.txt').read().split('\n')))

    for project in configuration:
        for team in project['teams']:
            team_skills_set = set(map(lambda x: x.lower(), team["skills"]))
            team['members'] = []
            # in case team do not need soft skills
            skill_flag = len(soft_skills.intersection(team_skills_set))

            # search for people for team
            while len(team_skills_set):

                # search for best people for team
                best_person = None
                best_person_id = 0
                best_intersection = 0
                for i, person in enumerate(df.to_dict('records')):

                    # if person is free
                    if person['project'] == '':
                        person_hard_skills_set = set(map(lambda x: x.lower(), person['Hard Skills'].split(', ')))
                        person_soft_skills_set = set(map(lambda x: x.lower(), person['Soft Skills'].split(', ')))

                        # looking for person with biggest skill intersection with project
                        hard_intersection_len = len(person_hard_skills_set.intersection(team_skills_set))
                        soft_intersection_len = len(person_soft_skills_set.intersection(team_skills_set))
                        if hard_intersection_len > best_intersection and (soft_intersection_len or not skill_flag):
                            best_intersection = hard_intersection_len
                            best_person = person
                            best_person_id = i

                # add best_person to the team
                if best_person:
                    df['project'][best_person_id] = project['name']
                    df['team'][best_person_id] = team['name']
                    best_person_skills_set = set(best_person['Hard Skills'].split(', '))
                    team_skills_set = team_skills_set.difference(best_person_skills_set)
                    team['members'].append(people[best_person_id])
                else:
                    # if we did not find more people for project
                    break

    for project in configuration:
        for team in project['teams']:
            team_skills_set = set(map(lambda x: x.lower(), team["skills"]))
            # in case team do not need soft skills
            skill_flag = len(soft_skills.intersection(team_skills_set))

            while len(team['members']) != team['size']:
                # search for best people for team
                best_person = None
                best_person_id = 0
                best_intersection = 0
                for i, person in enumerate(df.to_dict('records')):

                    # if person is free
                    if person['project'] == '':
                        person_hard_skills_set = set(map(lambda x: x.lower(), person['Hard Skills'].split(', ')))
                        person_soft_skills_set = set(map(lambda x: x.lower(), person['Soft Skills'].split(', ')))

                        # looking for person with biggest skill intersection with project
                        hard_intersection_len = len(person_hard_skills_set.intersection(team_skills_set))
                        soft_intersection_len = len(person_soft_skills_set.intersection(team_skills_set))
                        if hard_intersection_len > best_intersection and (soft_intersection_len or not skill_flag):
                            best_intersection = hard_intersection_len
                            best_person = person
                            best_person_id = i

                # add best_person to the team
                if best_person:
                    df['project'][best_person_id] = project['name']
                    df['team'][best_person_id] = team['name']
                    team['members'].append(people[best_person_id])
                else:
                    # if we did not find more people for project
                    break

    df.to_excel(f'{app.WORKING_FOLDER}/{file}', index=False)
