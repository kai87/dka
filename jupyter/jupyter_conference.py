#!/usr/bin/env python
# coding: utf-8

# In[1]:


# get_ipython().run_line_magic('load_ext', 'lab_black')
import pandas as pd
import numpy as np
from collections import Counter
from tqdm import tqdm
import pickle
import os

CONFERENCE_SERIES = "mag/ConferenceSeries.txt"
CONFERENCE_SERIES_HEADER = [
    "ConferenceSeriesId",
    "Rank",
    "NormalizedName",
    "DisplayName",
    "PaperCount",
    "CitationCount",
    "CreatedDate",
]
CONFERENCE_INSTANCES = "mag/ConferenceInstances.txt"
CONFERENCE_INSTANCES_HEADER = [
    "ConferenceInstanceId",
    "NormalizedName",
    "DisplayName",
    "ConferenceSeriesId",
    "Location",
    "OfficialUrl",
    "StartDate",
    "EndDate",
    "AbstractRegistrationDate",
    "SubmissionDeadlineDate",
    "NotificationDueDate",
    "FinalVersionDueDate",
    "PageCount",
    "CitationCount",
    "Latitude",
    "Longitude",
    "CreatedDate",
]
PAPERS = "mag/Papers.txt"
PAPERS_HEADER = [
    "PaperId",
    "Rank",
    "Doi",
    "DocType",
    "PaperTitle",
    "OriginalTitle",
    "BookTitle",
    "Year",
    "Date",
    "Publisher",
    "JournalId",
    "ConferenceSeriesId",
    "ConferenceInstanceId",
    "Volumne",
    "Issue",
    "FirstPage",
    "LastPage",
    "ReferenceCount",
    "CitationCount",
    "EstimatedCitation",
    "OriginalVenue",
    "FamilyId",
    "CreatedDate",
]
PAPER_AUTHOR_AFFILIATIONS = "mag/PaperAuthorAffiliations.txt"
PAPER_AUTHOR_AFFILIATIONS_HEADER = [
    "PaperId",
    "AuthorId",
    "AffiliationId",
    "AuthorSequenceNumber",
    "OriginalAuthor",
    "OritinalAffiliation",
]
AUTHOR = "mag/Authors.txt"
AUTHOR_HEADER = [
    "AuthorId",
    "Rank",
    "NormalizedName",
    "DisplayName",
    "LastKnownAffiliationId",
    "PaperCount",
    "CitationCount",
    "CreateDate",
]
PAPER_FIELDS_OF_STUDY = "mag/PaperFieldsOfStudy.txt"
PAPER_FIELDS_OF_STUDY_HEADER = ["PaperId", "FieldOfStudyId", "Score"]
FIELDS_OF_STUDY = "mag/FieldsOfStudy.txt"
FIELDS_OF_STUDY_HEADER = [
    "FieldOfStudyId",
    "Rank",
    "NormalizedName",
    "DisplayName",
    "MainType",
    "Level",
    "PaperCount",
    "CitationCount",
    "CreateDate",
]


# In[2]:


def extract_conferences(interested_range):
    with open(CONFERENCE_SERIES) as fp:
        conference_series_df = pd.read_csv(
            fp, sep="\t", header=None, names=CONFERENCE_SERIES_HEADER
        )

    with open(CONFERENCE_INSTANCES) as fp:
        conference_instances_df = pd.read_csv(
            fp, sep="\t", header=None, names=CONFERENCE_INSTANCES_HEADER
        )

    kdd_series = conference_series_df[conference_series_df.NormalizedName == "KDD"]
    kdd_instances = conference_instances_df[
        (
            conference_instances_df.ConferenceSeriesId
            == kdd_series.ConferenceSeriesId.iloc[0]
        )
        & (conference_instances_df.DisplayName.isin(interested_range))
    ]
    kdd_instances.to_csv(r"results/kdd_instances.csv")


# In[3]:


def extract_papers(kdd_instances, num_loops=-1):
    chunksize = 10 ** 6
    count = 0
    paperCounter = Counter({})
    relevantPapers = pd.DataFrame(columns=PAPERS_HEADER)
    for chunk in pd.read_csv(
        PAPERS,
        chunksize=chunksize,
        sep="\t",
        header=None,
        names=PAPERS_HEADER,
        low_memory=False,
    ):
        count += 1
        print(f"Processing {chunksize * (count - 1)} - {chunksize * count}")
        paperCounter += Counter(
            dict(
                pd.to_numeric(chunk.Year, errors="coerce")
                .astype("Int32")
                .value_counts()
            )
        )
        relevantPapers = relevantPapers.append(
            chunk[
                chunk.ConferenceInstanceId.isin(
                    list(kdd_instances.ConferenceInstanceId)
                )
            ],
            ignore_index=True,
        )
        if count == num_loops:
            break
    all_paper_count = (
        pd.DataFrame.from_dict(paperCounter, orient="index")
        .reset_index()
        .rename(columns={"index": "year", 0: "count"})
    )
    all_paper_count.to_csv(r"results/all_paper_count.csv")
    relevantPapers.to_csv(r"results/kdd_papers.csv")


# In[4]:


def extract_paper_author_affiliation(kdd_papers, num_loops=-1):
    chunksize = 10 ** 7
    count = 0
    relavantPaperAuthorAffiliations = pd.DataFrame(
        columns=PAPER_AUTHOR_AFFILIATIONS_HEADER
    )
    for chunk in pd.read_csv(
        PAPER_AUTHOR_AFFILIATIONS,
        chunksize=chunksize,
        sep="\t",
        header=None,
        names=PAPER_AUTHOR_AFFILIATIONS_HEADER,
    ):
        count += 1
        print(f"Processing {chunksize * (count - 1)} - {chunksize * count}")
        relavantPaperAuthorAffiliations = relavantPaperAuthorAffiliations.append(
            chunk[chunk.PaperId.isin(list(kdd_papers.PaperId))], ignore_index=True
        )
        if count == num_loops:
            break
    relavantPaperAuthorAffiliations.to_csv(r"results/kdd_paper_author_affiliations.csv")


# In[5]:


def extract_author(kdd_paper_author_affiliation, num_loops=-1):
    chunksize = 10 ** 6
    count = 0
    relevantAuthors = pd.DataFrame(columns=AUTHOR_HEADER)
    for chunk in pd.read_csv(
        AUTHOR, chunksize=chunksize, sep="\t", header=None, names=AUTHOR_HEADER
    ):
        count += 1
        print(f"Processing {chunksize * (count - 1)} - {chunksize * count}")
        relevantAuthors = relevantAuthors.append(
            chunk[chunk.AuthorId.isin(list(kdd_paper_author_affiliation.AuthorId))],
            ignore_index=True,
        )
        if count == num_loops:
            break
    relevantAuthors.to_csv(r"results/kdd_authors.csv")


# In[6]:


def extract_paper_author_affiliation_for_authors(kdd_authors, num_loops=-1):
    chunksize = 10 ** 7
    count = 0
    relavantPaperAuthorAffiliations = pd.DataFrame(
        columns=PAPER_AUTHOR_AFFILIATIONS_HEADER
    )
    for chunk in pd.read_csv(
        PAPER_AUTHOR_AFFILIATIONS,
        chunksize=chunksize,
        sep="\t",
        header=None,
        names=PAPER_AUTHOR_AFFILIATIONS_HEADER,
    ):
        count += 1
        print(f"Processing {chunksize * (count - 1)} - {chunksize * count}")
        relavantPaperAuthorAffiliations = relavantPaperAuthorAffiliations.append(
            chunk[chunk.AuthorId.isin(list(kdd_authors.AuthorId))], ignore_index=True
        )
        if count == num_loops:
            break
    relavantPaperAuthorAffiliations.to_csv(
        r"results/kdd_paper_author_affiliations_for_authors.csv"
    )


# In[7]:


def extract_paper_fields_of_study(paper_list, num_loops=-1):
    chunksize = 10 ** 7
    count = 0
    relevantPaperFieldsOfStudy = pd.DataFrame(columns=PAPER_FIELDS_OF_STUDY_HEADER)
    for chunk in pd.read_csv(
        PAPER_FIELDS_OF_STUDY,
        chunksize=chunksize,
        sep="\t",
        header=None,
        names=PAPER_FIELDS_OF_STUDY_HEADER,
    ):
        count += 1
        print(f"Processing {chunksize * (count - 1)} - {chunksize * count}")
        relevantPaperFieldsOfStudy = relevantPaperFieldsOfStudy.append(
            chunk[chunk.PaperId.isin(paper_list)], ignore_index=True
        )
        if count == num_loops:
            break
    relevantPaperFieldsOfStudy.to_csv(r"results/paper_fields_of_study.csv")


# In[8]:


def save_dataframe_to_file(dataframe, filepath):
    os.remove(filepath)
    with open(filepath, "a") as fd:
        fd.write(f'{",".join(map(str, dataframe.columns))}')
        for index in tqdm(range(len(dataframe))):
            fd.write(f'\n{",".join(map(str, dataframe.iloc[index]))}')


# In[103]:


def convert_fields_of_study_to_feature_vector(paper_fields_of_study):
    table_dict = {}
    for paperId in tqdm(list(set(paper_fields_of_study.PaperId))[0:10000]):
        dataframe = paper_fields_of_study[paper_fields_of_study.PaperId == paperId]
        table = pd.pivot_table(
            dataframe,
            values="Score",
            index=["PaperId"],
            columns=["FieldOfStudyId"],
            aggfunc=np.sum,
        )
        table_dict.update(table.T.to_dict())
    dataframe = pd.DataFrame(table_dict).fillna(0).T.round(3)

    with open(FIELDS_OF_STUDY) as fp:
        fields_of_study_df = pd.read_csv(
            fp, sep="\t", header=None, names=FIELDS_OF_STUDY_HEADER
        )

        level2_fields = sorted(
            list(
                fields_of_study_df[
                    (fields_of_study_df.FieldOfStudyId.isin(dataframe.columns))
                    & (fields_of_study_df.Level == 2)
                ].FieldOfStudyId
            )
        )
        dataframe = dataframe[level2_fields]
        dataframe.columns = [
            fields_of_study_df[fields_of_study_df.FieldOfStudyId == id]
            .iloc[0]
            .NormalizedName
            for id in dataframe.columns
        ]
    dataframe.to_csv(r"results/paper_features.csv")
    return level2_fields


# In[101]:


def generate_author_features(
    paper_author_affiliation_for_authors, paper_fields_of_study, field_order
):
    dictionary = {}
    for authorId in tqdm(set(paper_author_affiliation_for_authors.AuthorId)):
        paperIds = list(
            paper_author_affiliation_for_authors[
                paper_author_affiliation_for_authors.AuthorId == authorId
            ].PaperId
        )
        fields = (
            paper_fields_of_study[paper_fields_of_study.PaperId.isin(paperIds)]
            .filter(["FieldOfStudyId", "Score"])
            .groupby("FieldOfStudyId")
            .mean()
        )
        fields_dictionary = dict(zip(fields.index, fields.Score.values))
        dictionary[authorId] = fields_dictionary

    dataframe = pd.DataFrame(dictionary).fillna(0).T.round(3)
    dataframe = dataframe[field_order]
    with open(FIELDS_OF_STUDY) as fp:
        fields_of_study_df = pd.read_csv(
            fp, sep="\t", header=None, names=FIELDS_OF_STUDY_HEADER
        )

        dataframe.columns = [
            fields_of_study_df[fields_of_study_df.FieldOfStudyId == id]
            .iloc[0]
            .NormalizedName
            for id in dataframe.columns
        ]
    dataframe.to_csv(r"results/author_features.csv")


# In[104]:


extract_conferences(["KDD 2019", "KDD 2018", "KDD 2017", "KDD 2016", "KDD 2015"])
kdd_instances = pd.read_csv(r"results/kdd_instances.csv", index_col=0)
extract_papers(kdd_instances)
kdd_papers = pd.read_csv(r"results/kdd_papers.csv", index_col=0)
extract_paper_author_affiliation(kdd_papers)
kdd_paper_author_affiliation = pd.read_csv(
    r"results/kdd_paper_author_affiliations.csv", index_col=0
)
extract_author(kdd_paper_author_affiliation)
kdd_authors = pd.read_csv(r"results/kdd_authors.csv", index_col=0)
extract_paper_author_affiliation_for_authors(kdd_authors)
paper_author_affiliation_for_authors = pd.read_csv(
    r"results/kdd_paper_author_affiliations_for_authors.csv", index_col=0
)
extract_paper_fields_of_study(list(paper_author_affiliation_for_authors.PaperId))
paper_fields_of_study = pd.read_csv(r"results/paper_fields_of_study.csv", index_col=0)
kdd_paper_fields_of_study = paper_fields_of_study[
    paper_fields_of_study.PaperId.isin(kdd_papers.PaperId)
]
fields = convert_fields_of_study_to_feature_vector(kdd_paper_fields_of_study)
paper_fields_of_study = paper_fields_of_study[
    paper_fields_of_study.FieldOfStudyId.isin(fields)
]
generate_author_features(
    paper_author_affiliation_for_authors, paper_fields_of_study, fields
)


# In[107]:


paper_features = pd.read_csv(r"results/paper_features.csv", index_col=0)
auther_features = pd.read_csv(r"results/author_features.csv", index_col=0)
paper_features.columns == auther_features.columns

