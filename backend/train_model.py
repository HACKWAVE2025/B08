from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

train_dir = "../dataset/train"
test_dir = "../dataset/test"

train_datagen = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

train_data = train_datagen.flow_from_directory(
    train_dir, target_size=(64, 64), batch_size=32, class_mode='categorical'
)

test_data = test_datagen.flow_from_directory(
    test_dir, target_size=(64, 64), batch_size=32, class_mode='categorical'
)

model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(64,64,3)),
    MaxPooling2D(2,2),
    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D(2,2),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(2, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(train_data, validation_data=test_data, epochs=5)

os.makedirs("model", exist_ok=True)
model.save("model/waste_classifier.h5")

print("✅ Model trained and saved successfully!")
