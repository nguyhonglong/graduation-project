import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import style from './DGA.module.css';

const DGA = ({ currentTransformer }) => {
  const canvasRef = useRef(null);
  const [dgaData, setDgaData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (currentTransformer && selectedDate) {
      axios.get(`http://localhost:3000/v1/indexes/${currentTransformer._id}?date=${selectedDate}`)
        .then(response => {
          setDgaData(response.data);
        })
        .catch(error => {
          console.error('Error fetching DGA data:', error);
        });
    }
  }, [currentTransformer, selectedDate]);

  useEffect(() => {
    if (dgaData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Define the drawDuvalTriangle function
      const drawDuvalTriangle = () => {
        var ctx = canvas.getContext("2d");

        // Define triangle vertices
        var v0 = { x: 114, y: 366 };
        var v1 = { x: 306, y: 30 };
        var v2 = { x: 498, y: 366 };
        var triangle = [v0, v1, v2];

        // Define point size
        var pointSize = 4.5;

        // Define segments (you should copy this from your original duval.js)
        var segments = [
          // ... copy your segments array here ...
        ];

        // Helper functions
        function drawTriangle(t) {
          ctx.beginPath();
          ctx.moveTo(t[0].x, t[0].y);
          ctx.lineTo(t[1].x, t[1].y);
          ctx.lineTo(t[2].x, t[2].y);
          ctx.closePath();
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        function moleculeLabel(start, end, offsetLength, angle, text) {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '14px verdana';
          var dx = end.x - start.x;
          var dy = end.y - start.y;
          var x0 = parseInt(start.x + dx * 0.50);
          var y0 = parseInt(start.y + dy * 0.50);
          var x1 = parseInt(x0 + offsetLength * Math.cos(angle));
          var y1 = parseInt(y0 + offsetLength * Math.sin(angle));
          ctx.fillStyle = 'black';
          ctx.fillText(text, x1, y1);
          // Arrow drawing code here (if needed)
        }

        function ticklines(start, end, count, angle, length) {
          var dx = end.x - start.x;
          var dy = end.y - start.y;
          ctx.lineWidth = 1;
          for (var i = 1; i < count; i++) {
            var x0 = parseInt(start.x + dx * i / count);
            var y0 = parseInt(start.y + dy * i / count);
            var x1 = parseInt(x0 + length * Math.cos(angle));
            var y1 = parseInt(y0 + length * Math.sin(angle));
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            if (i == 2 || i == 4 || i == 6 || i == 8) {
              var labelOffset = length * 3 / 4;
              x1 = parseInt(x0 - labelOffset * Math.cos(angle));
              y1 = parseInt(y0 - labelOffset * Math.sin(angle));
              ctx.fillStyle = 'black';
              ctx.fillText(parseInt(i * 10), x1, y1);
            }
          }
        }

        function drawLegend(texts, x, y, lineheight) {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillStyle = 'black';
          ctx.font = '14px Verdana';
          for (var i = 0; i < texts.length; i++) {
            ctx.fillText(texts[i], x, y + i * lineheight);
          }
        }

        function drawSegment(s) {
          ctx.beginPath();
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (var i = 1; i < s.points.length; i++) {
            ctx.lineTo(s.points[i].x, s.points[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = s.fill;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'black';
          ctx.stroke();

          // Draw label if present
          if (s.label) {
            if (s.label.withLine) {
              lineBoxedLabel(s, 12, 'verdana', 3);
            } else {
              boxedLabel(s, 12, 'verdana', 3);
            }
          }
        }

        function boxedLabel(s, fontsize, fontface, padding) {
          var centerX = s.label.cx;
          var centerY = s.label.cy;
          var text = s.label.text;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = fontsize + 'px ' + fontface;
          var textwidth = ctx.measureText(text).width;
          var textheight = fontsize * 1.286;
          var leftX = centerX - textwidth / 2 - padding;
          var topY = centerY - textheight / 2 - padding;
          ctx.fillStyle = 'white';
          ctx.fillRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
          ctx.lineWidth = 1;
          ctx.strokeRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
          ctx.fillStyle = 'black';
          ctx.fillText(text, centerX, centerY);
        }

        function lineBoxedLabel(s, fontsize, fontface, padding) {
          var centerX = s.label.cx;
          var centerY = s.label.cy;
          var text = s.label.text;
          var lineToX = s.label.endX;
          var lineToY = s.label.endY;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = fontsize + 'px ' + fontface;
          var textwidth = ctx.measureText(text).width;
          var textheight = fontsize * 1.286;
          var leftX = centerX - textwidth / 2 - padding;
          var topY = centerY - textheight / 2 - padding;
          // the line
          ctx.beginPath();
          ctx.moveTo(leftX, topY + textheight / 2);
          ctx.lineTo(lineToX, topY + textheight / 2);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1;
          ctx.stroke();
          // the boxed text
          ctx.fillStyle = 'white';
          ctx.fillRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
          ctx.strokeRect(leftX, topY, textwidth + padding * 2, textheight + padding * 2);
          ctx.fillStyle = 'black';
          ctx.fillText(text, centerX, centerY);
        }

        function calcOprByValue(ch4, c2h2, c2h4) {
          // Implementation of calcOprByValue
          // This function should calculate the point position based on gas values
          // and call drawCoordinates and drawCords
        }

        // Draw the initial triangle and labels
        drawTriangle(triangle);
        moleculeLabel(v0, v1, 100, Math.PI, '% CH4');
        moleculeLabel(v1, v2, 100, 0, '% C2H4');
        moleculeLabel(v2, v0, 75, Math.PI / 2, '% C2H2');
        ticklines(v0, v1, 9, 0, 20);
        ticklines(v1, v2, 9, Math.PI * 3 / 4, 20);
        ticklines(v2, v0, 9, Math.PI * 5 / 4, 20);

        // Define and draw legend
        var legendTexts = [
          'PD = Partial Discharge',
          'T1 = Thermal fault < 300 celcius',
          'T2 = Thermal fault 300 < T < 700 celcius',
          'T3 = Thermal fault > 700 celcius',
          'D1 = Discharges of low energy',
          'D2 = Discharges of high energy',
          'DT = Electrical and thermal faults'
        ];
        drawLegend(legendTexts, 75, 450, 15);

        // Make sure to define the segments array correctly
        var segments = [
          {
            points: [{x: 114, y: 366}, {x: 281, y: 76}, {x: 324, y: 150}, {x: 201, y: 366}],
            fill: 'rgb(172,236,222)',
            label: {text: 'D1', cx: 165, cy: 395, withLine: false}
          },
          {
            points: [{x: 385, y: 366}, {x: 201, y: 366}, {x: 324, y: 150}, {x: 356, y: 204}, {x: 321, y: 256}],
            fill: 'rgb(51,51,153)',
            label: {text: 'D2', cx: 300, cy: 395, withLine: false}
          },
          // ... (add the rest of the segments here)
        ];

        // Draw colored segments
        for (var i = 0; i < segments.length; i++) {
          drawSegment(segments[i]);
        }

        // Call calcOprByValue with the current DGA data
        calcOprByValue(dgaData.Methane, dgaData.Acetylene, dgaData.Ethylene);
      };

      // Call the function to draw the Duval Triangle
      drawDuvalTriangle();
    }
  }, [dgaData]);

  if (!currentTransformer) {
    return <div className={style.noTransformer}>Please select a transformer</div>;
  }

  return (
    <div className={style.dgaContainer}>
      <h2>{currentTransformer.name} - DGA Analysis</h2>
      <div className={style.datePickerContainer}>
        <label htmlFor="datePicker">Select Date: </label>
        <input
          type="date"
          id="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      {dgaData ? (
        <>
          <canvas ref={canvasRef} width={650} height={580} className={style.canvas}></canvas>
          <div className={style.dgaValues}>
            <p>CH4 (Methane): {dgaData.Methane} ppm</p>
            <p>C2H2 (Acetylene): {dgaData.Acetylene} ppm</p>
            <p>C2H4 (Ethylene): {dgaData.Ethylene} ppm</p>
          </div>
        </>
      ) : (
        <div className={style.loading}>Loading DGA data...</div>
      )}
    </div>
  );
};

export default DGA;