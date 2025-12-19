export const MOCK_CONVERSATIONS = [
    {
        id: "conv_1",
        title: "Project Architecture Debate",
        created_at: "2023-10-27T10:00:00Z",
        message_count: 5
    },
    {
        id: "conv_2",
        title: "React Performance Optimization",
        created_at: "2023-10-26T14:30:00Z",
        message_count: 3
    }
];

export const MOCK_MESSAGES = [
    {
        id: "msg_system",
        role: "system",
        content: "System initialized."
    },
    {
        id: "msg_user_1",
        role: "user",
        content: "Analyze this dataset and build a predictive model."
    },
    {
        id: "msg_bot_1",
        role: "assistant",
        content: "I have processed the dataset. The workflow involved feature engineering followed by model selection. Here are the results.",
        council_data: {
            steps: [
                {
                    id: "step_fe",
                    title: "Feature Engineering",
                    status: "completed",
                    data: {
                        stage1: [
                            { model: "GPT-4", response: "Imputed missing values in 'Age' using median. Dropped 'Cabin' due to high nulls.", raw_response: {} },
                            { model: "Claude-3-Opus", response: "Created 'FamilySize' from 'SibSp' + 'Parch'. Encoded 'Sex' using OneHot.", raw_response: {} },
                            { model: "Gemini-Pro", response: "Applied StandardScaler to numerical features. No outliers detected.", raw_response: {} }
                        ],
                        stage2: [
                            { model: "GPT-4", ranking: "RANKING:\n1. Claude-3-Opus (High impact)\n2. Gemini-Pro\n3. GPT-4" },
                            { model: "Claude-3-Opus", ranking: "RANKING:\n1. Claude-3-Opus\n2. GPT-4\n3. Gemini-Pro" },
                            { model: "Gemini-Pro", ranking: "RANKING:\n1. GPT-4\n2. Claude-3-Opus\n3. Gemini-Pro" }
                        ],
                        stage3: {
                            model: "Chairman-GPT-4",
                            response: "Consensus: The council has evaluated all proposals and reached a unanimous decision.\n\n1. **Imputation Strategy**: We will adopt the Median Imputation method for the 'Age' column. This is more robust to the observed skewness in the distribution compared to mean imputation. The Data-Cleaner-Bot's analysis showed a 15% reduction in variance with this approach.\n\n2. **Feature Engineering**: The 'FamilySize' feature (derived from SibSp + Parch) shows a strong correlation (0.78) with survival rates. We will proceed with this feature. Additionally, we will encode 'Sex' using OneHotEncoding as suggested by Claude-3-Opus to maximize compatibility with the downstream XGBoost model.\n\n3. **Scaling**: StandardScaling will be applied to all numerical inputs. Outlier detection was performed, but the detected points were deemed significant edge cases rather than errors, so no data points will be dropped.\n\n**Final Directive**: Proceed with the pipeline: Median Imputer -> FamilySize Creator -> OneHotEncoder -> StandardScaler."
                        }
                    }
                },
                {
                    id: "step_model",
                    title: "Modeling Strategy",
                    status: "completed",
                    data: {
                        stage1: [
                            { model: "Groq-Llama-3", response: "Suggest XGBoost with max_depth=5. It handles non-linearity well.", raw_response: {} },
                            { model: "Claude-3-Sonnet", response: "Random Forest is more robust to overfitting here. n_estimators=100.", raw_response: {} },
                            { model: "Gemini-Flash", response: "Start with Logistic Regression to establish a baseline. Simpler is better.", raw_response: {} }
                        ],
                        stage2: [
                            { model: "Groq-Llama-3", ranking: "RANKING:\n1. Groq-Llama-3\n2. Claude-3-Sonnet\n3. Gemini-Flash" },
                            { model: "Claude-3-Sonnet", ranking: "RANKING:\n1. Claude-3-Sonnet\n2. Groq-Llama-3\n3. Gemini-Flash" },
                            { model: "Gemini-Flash", ranking: "RANKING:\n1. Gemini-Flash\n2. Claude-3-Sonnet\n3. Groq-Llama-3" }
                        ],
                        stage3: {
                            model: "Chairman-GPT-4",
                            response: "Decision: Train XGBoost as the primary model due to expected non-linearities, but run Logistic Regression in parallel as a baseline sanity check."
                        }
                    }
                }
            ]
        }
    }
];
