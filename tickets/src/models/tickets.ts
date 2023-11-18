import mongoose from "mongoose";

// An interface that describes the properties that are required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that are for the Ticket Doc created using mongoose
interface TicketDocProps extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties that a Ticket Model has
interface TicketModelProps extends mongoose.Model<TicketDocProps> {
  build(ticket: TicketAttrs): TicketDocProps;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Add a static function that we can call with the Ticket model like
// User.build({
//   title:"Ticket-1",
//   price:50
// })
ticketSchema.statics.build = (ticket: TicketAttrs) => {
  return new Ticket(ticket);
};

// <> In angle brackets the first one is the Document Props and the second One is the returning value which we pass
// User model somewhat returns an object of type TicketModelProps
const Ticket = mongoose.model<TicketDocProps, TicketModelProps>(
  "Ticket",
  ticketSchema
);

export { Ticket };
