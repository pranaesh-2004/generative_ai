from pathlib import Path

from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForMaskedLM,
    DataCollatorForLanguageModeling,
    Trainer,
    TrainingArguments,
)

MODEL_NAME = "distilbert-base-uncased"

BASE_DIR = Path(__file__).resolve().parent
CORPUS_FILE = BASE_DIR / "feedback_corpus.txt"
OUTPUT_DIR = BASE_DIR.parent / "models" / "distilbert_feedback_mlm"


def tokenize_function(examples, tokenizer):
    return tokenizer(
        examples["text"],
        truncation=True,
        max_length=128,
        return_special_tokens_mask=True,
    )


def group_texts(examples, chunk_size=128):
    concatenated_examples = {k: sum(examples[k], []) for k in examples.keys()}
    total_length = len(concatenated_examples["input_ids"])

    total_length = (total_length // chunk_size) * chunk_size
    if total_length == 0:
        return {k: [] for k in concatenated_examples.keys()}

    result = {
        k: [t[i : i + chunk_size] for i in range(0, total_length, chunk_size)]
        for k, t in concatenated_examples.items()
    }
    return result


def main():
    if not CORPUS_FILE.exists():
        raise FileNotFoundError(f"Corpus file not found: {CORPUS_FILE}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    dataset = load_dataset("text", data_files={"train": str(CORPUS_FILE)})

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForMaskedLM.from_pretrained(MODEL_NAME)

    tokenized_dataset = dataset.map(
        lambda examples: tokenize_function(examples, tokenizer),
        batched=True,
        remove_columns=["text"],
    )

    lm_dataset = tokenized_dataset.map(
        group_texts,
        batched=True,
    )

    data_collator = DataCollatorForLanguageModeling(
        tokenizer=tokenizer,
        mlm=True,
        mlm_probability=0.15,
    )

    training_args = TrainingArguments(
    output_dir=str(OUTPUT_DIR),
    num_train_epochs=3,
    per_device_train_batch_size=8,
    save_steps=500,
    save_total_limit=2,
    logging_steps=50,
    learning_rate=5e-5,
    weight_decay=0.01,
)

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=lm_dataset["train"],
        data_collator=data_collator,
    )

    trainer.train()
    trainer.save_model(str(OUTPUT_DIR))
    tokenizer.save_pretrained(str(OUTPUT_DIR))

    print(f"Domain-adapted model saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()