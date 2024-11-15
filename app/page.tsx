'use client';
import './globals.css';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Book, Code, PlayCircle } from 'lucide-react';

const GetNextLineVisualizer = () => {
  const [inputText, setInputText] = useState("First line\nSecond line\nThird line");
  const [bufferSize, setBufferSize] = useState(5);
  const [currentLine, setCurrentLine] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [staticBuffer, setStaticBuffer] = useState("");
  const [completed, setCompleted] = useState(false);

  const lines = inputText.split('\n');

  const simulateGNL = () => {
    if (completed || currentLine >= lines.length) {
      setCompleted(true);
      return;
    }

    // Simulate reading from buffer
    const newBuffer = lines[currentLine];
    setBuffer(newBuffer.slice(0, bufferSize));
    setStaticBuffer(prevBuffer => prevBuffer + newBuffer.slice(0, bufferSize));
    setCurrentLine(prev => prev + 1);
  };

  const resetSimulation = () => {
    setCurrentLine(0);
    setBuffer("");
    setStaticBuffer("");
    setCompleted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-6 w-6" /> Get Next Line Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="explanation">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="explanation">Explanation</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="explanation" className="space-y-4">
              <div className="prose max-w-none">
                <h3 className="flex items-center gap-2">
                  <Book className="h-5 w-5" /> How Get Next Line Works
                </h3>
                <p>
                  Get Next Line (GNL) is a function that reads a line from a file descriptor.
                  Key concepts:
                </p>
                <ul>
                  <li>Reads file until newline or EOF is found</li>
                  <li>Uses static variable to store leftover data</li>
                  <li>Returns line including newline character</li>
                  <li>Returns NULL when EOF is reached</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {`char *get_next_line(int fd)
{
    static char *remainder;
    char *line;
    char *buffer;
    int bytes_read;

    if (fd < 0 || BUFFER_SIZE <= 0)
        return (NULL);
    buffer = malloc(BUFFER_SIZE + 1);
    if (!buffer)
        return (NULL);
    bytes_read = 1;
    while (!find_newline(remainder) && bytes_read)
    {
        bytes_read = read(fd, buffer, BUFFER_SIZE);
        if (bytes_read == -1)
        {
            free(buffer);
            return (NULL);
        }
        buffer[bytes_read] = '\\0';
        remainder = join_strings(remainder, buffer);
    }
    free(buffer);
    line = extract_line(&remainder);
    return (line);
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Text:</label>
                  <Textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buffer Size:</label>
                  <input 
                    type="number"
                    value={bufferSize}
                    onChange={(e) => setBufferSize(parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={1}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={simulateGNL} disabled={completed}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Read Next Line
                  </Button>
                  <Button onClick={resetSimulation} variant="outline">
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Current Buffer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-2 rounded">
                        {buffer || "(empty)"}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Static Buffer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-2 rounded">
                        {staticBuffer || "(empty)"}
                      </pre>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded p-4">
                  <h4 className="font-medium mb-2">Lines Read:</h4>
                  <div className="space-y-2">
                    {lines.map((line, index) => (
                      <div 
                        key={index}
                        className={`flex items-center gap-2 ${
                          index === currentLine ? "text-blue-600 font-medium" : 
                          index < currentLine ? "text-green-600" : ""
                        }`}
                      >
                        {index < currentLine && <ArrowRight className="h-4 w-4" />}
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetNextLineVisualizer;
