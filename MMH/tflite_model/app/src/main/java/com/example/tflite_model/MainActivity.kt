package com.example.tflite_model

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import com.example.tflite_model.ml.SsdMobilenetV1Fpn640TfliteQuantized
import org.tensorflow.lite.support.image.TensorImage

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)


        val model = SsdMobilenetV1Fpn640TfliteQuantized.newInstance(this)

// Creates inputs for reference.
        val bitmap = BitmapFactory.decodeResource(resources, R.drawable.oui)
        val image = TensorImage.fromBitmap(bitmap)

// Runs model inference and gets result.
        val outputs = model.process(image)
        println("Output: " + outputs)
        val detectionResult = outputs.detectionResultList.get(0)
        println("detectionResult: " + detectionResult)

// Gets result from DetectionResult.
        val location = detectionResult.locationAsRectF;
        val category = detectionResult.categoryAsString;
        val score = detectionResult.scoreAsFloat;

        println("location: " + location)
        println("category: " + category)
        println("score: " + score)
        val textView = findViewById(R.id.tv) as TextView
        val imageView = findViewById(R.id.iv) as ImageView
        textView.setText("category: " + category + "\nscore" + score)

        imageView.setImageBitmap(bitmap)

// Releases model resources if no longer used.
        model.close()
    }
}