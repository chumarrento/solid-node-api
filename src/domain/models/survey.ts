export type SurveyModel = {
  id: string
  question: string
  answers: SurveyAnswer[]
  date: Date
  didAnswer?: boolean
}

type SurveyAnswer = {
  image?: string
  answer: string
}
