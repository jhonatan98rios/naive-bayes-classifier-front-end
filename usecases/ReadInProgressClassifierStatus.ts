import { ClassifierDTO, STATUS } from "@/domain/entities/Classifier";
import { Session } from "next-auth";

export async function readClassifier(id: string, session: Session): Promise<ClassifierDTO> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_READ_CLASSIFIER_ENDPOINT}${id}`, {
    headers: {
      //@ts-ignore
      "Authorization": session?.accessToken,
    }
  });

  const data: ClassifierDTO = await response.json()
  return data
}

export async function readInProgressClassifiers(classifiers: ClassifierDTO[], session: Session) {
  let areThereInProgressClassifiers = false
  let areThereChanges = false

  console.log("updating...")

  const updatedClassifiers = await Promise.all(
    classifiers.map(async (classifier: any) => {
      if (classifier.status !== STATUS.INPROGRESS) {
        return classifier
      }

      areThereInProgressClassifiers = true
      const updatedClassifier = await readClassifier(classifier.id, session)

      if (classifier.status !== updatedClassifier.status) {
        areThereChanges = true
        classifier = updatedClassifier
      }

      return classifier
    })
  )

  return { updatedClassifiers, areThereChanges, areThereInProgressClassifiers }
}