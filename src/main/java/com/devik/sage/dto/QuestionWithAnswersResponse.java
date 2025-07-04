package com.devik.sage.dto;

import lombok.Data;

@Data
public class QuestionWithAnswersResponse {
    private QuestionResponse question;
    private PageResponse<AnswerResponse> answers;
}
