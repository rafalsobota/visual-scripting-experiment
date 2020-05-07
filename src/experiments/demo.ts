class EventProducer<T> {
    public value: T | undefined;
    public output: OutputPort<T> = new OutputPort<T>();

    constructor(value?: T) {
        this.value = value;
    }

    public emit() {
        if (this.output !== undefined && this.value !== undefined) {
            this.output.emit(this.value);
        }
    }
}

class OutputPort<T> {
    private subscribers: Array<InputPort<T>> = [];

    public wire(p: InputPort<T>) {
        this.subscribers.push(p);
    }

    public emit(value: T) {
        this.subscribers.forEach(s => s.send(value));
    }
}

class InputPort<T> {

    constructor(c: (t:T) => void) {
        this.send = c;
    }

    public send: (value: T) => void
}

class StringPrinter {
    public input: InputPort<String> = new InputPort<String>(console.log);
}

export default function main() {

    const printNode = new StringPrinter();

    const eventNode = new EventProducer("Hello");

    eventNode.output.wire(printNode.input);

    eventNode.emit();

}