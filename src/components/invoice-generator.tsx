"use client"

import { useState } from "react"
import { jsPDF } from "jspdf"
import { format } from "date-fns"
import { Download, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Define types
interface InvoiceItem {
  id: string
  description: string
  hsnCode: string
  quantity: number
  rate: number
  taxRate: number
  taxType: "CGST/SGST" | "IGST"
}

interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  fromName: string
  fromAddress: string
  fromGstin: string
  fromEmail: string
  fromPhone: string
  toName: string
  toAddress: string
  toGstin: string
  toEmail: string
  toPhone: string
  items: InvoiceItem[]
  notes: string
}

export default function InvoiceGenerator() {
  const [activeTab, setActiveTab] = useState("details")
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    invoiceDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    fromName: "",
    fromAddress: "",
    fromGstin: "",
    fromEmail: "",
    fromPhone: "",
    toName: "",
    toAddress: "",
    toGstin: "",
    toEmail: "",
    toPhone: "",
    items: [
      {
        id: "1",
        description: "",
        hsnCode: "",
        quantity: 1,
        rate: 0,
        taxRate: 18,
        taxType: "CGST/SGST",
      },
    ],
    notes: "Thank you for your business!",
  })

  const handleInputChange = (field: string, value: string | number) => {
    setInvoiceData({
      ...invoiceData,
      [field]: value,
    })
  }

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    })
  }

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      hsnCode: "",
      quantity: 1,
      rate: 0,
      taxRate: 18,
      taxType: "CGST/SGST",
    }

    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem],
    })
  }

  const removeItem = (id: string) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter((item) => item.id !== id),
      })
    }
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  }

  const calculateTaxAmount = () => {
    return invoiceData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.rate
      return sum + (itemTotal * item.taxRate) / 100
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set document properties
    doc.setProperties({
      title: `Invoice ${invoiceData.invoiceNumber}`,
      subject: `Invoice for ${invoiceData.toName}`,
      creator: "InvoicePro",
    })

    // Add logo and title
    doc.setFillColor(39, 174, 96)
    doc.rect(0, 0, 210, 30, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.text("INVOICE", 105, 15, { align: "center" })
    doc.setFontSize(12)
    doc.text("InvoicePro", 105, 22, { align: "center" })

    // Reset text color
    doc.setTextColor(0, 0, 0)

    // Add invoice details
    doc.setFontSize(10)
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber}`, 15, 40)
    doc.text(`Invoice Date: ${format(new Date(invoiceData.invoiceDate), "dd/MM/yyyy")}`, 15, 45)
    doc.text(`Due Date: ${format(new Date(invoiceData.dueDate), "dd/MM/yyyy")}`, 15, 50)

    // From details
    doc.setFontSize(12)
    doc.text("From:", 15, 65)
    doc.setFontSize(10)
    doc.text(invoiceData.fromName, 15, 70)
    doc.text(invoiceData.fromAddress.split("\n"), 15, 75)
    doc.text(`GSTIN: ${invoiceData.fromGstin}`, 15, 85)
    doc.text(`Email: ${invoiceData.fromEmail}`, 15, 90)
    doc.text(`Phone: ${invoiceData.fromPhone}`, 15, 95)

    // To details
    doc.setFontSize(12)
    doc.text("Bill To:", 120, 65)
    doc.setFontSize(10)
    doc.text(invoiceData.toName, 120, 70)
    doc.text(invoiceData.toAddress.split("\n"), 120, 75)
    doc.text(`GSTIN: ${invoiceData.toGstin}`, 120, 85)
    doc.text(`Email: ${invoiceData.toEmail}`, 120, 90)
    doc.text(`Phone: ${invoiceData.toPhone}`, 120, 95)

    // Table header
    doc.setFillColor(240, 240, 240)
    doc.rect(15, 105, 180, 8, "F")
    doc.setFontSize(9)
    doc.text("Description", 17, 110)
    doc.text("HSN", 80, 110)
    doc.text("Qty", 100, 110)
    doc.text("Rate", 115, 110)
    doc.text("Tax", 135, 110)
    doc.text("Amount", 175, 110, { align: "right" })

    // Table content
    let y = 118
    invoiceData.items.forEach((item, index) => {
      doc.text(item.description, 17, y)
      doc.text(item.hsnCode, 80, y)
      doc.text(item.quantity.toString(), 100, y)
      doc.text(formatCurrency(item.rate).replace("₹", ""), 115, y)
      doc.text(`${item.taxRate}% ${item.taxType}`, 135, y)

      const amount = item.quantity * item.rate
      doc.text(formatCurrency(amount).replace("₹", ""), 175, y, { align: "right" })

      y += 8

      // Add a light gray line
      if (index < invoiceData.items.length - 1) {
        doc.setDrawColor(220, 220, 220)
        doc.line(15, y - 4, 195, y - 4)
      }
    })

    // Summary
    y += 10
    doc.setDrawColor(200, 200, 200)
    doc.line(15, y - 5, 195, y - 5)

    doc.text("Subtotal:", 140, y)
    doc.text(formatCurrency(calculateSubtotal()).replace("₹", ""), 175, y, { align: "right" })

    y += 6
    doc.text("Tax:", 140, y)
    doc.text(formatCurrency(calculateTaxAmount()).replace("₹", ""), 175, y, { align: "right" })

    y += 6
    doc.setFontSize(11)
    doc.text("Total:", 140, y)
    doc.text(formatCurrency(calculateTotal()).replace("₹", ""), 175, y, { align: "right" })

    // Notes
    y += 15
    doc.setFontSize(10)
    doc.text("Notes:", 15, y)
    doc.setFontSize(9)
    doc.text(invoiceData.notes.split("\n"), 15, y + 5)

    // Footer
    doc.setFontSize(8)
    doc.text("Generated with InvoicePro - www.invoicepro.in", 105, 285, { align: "center" })

    // Save the PDF
    doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`)
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="details">Company Details</TabsTrigger>
            <TabsTrigger value="items">Items & Taxes</TabsTrigger>
            <TabsTrigger value="preview">Preview & Download</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="fromName">Company Name</Label>
                  <Input
                    id="fromName"
                    value={invoiceData.fromName}
                    onChange={(e) => handleInputChange("fromName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromAddress">Address</Label>
                  <Textarea
                    id="fromAddress"
                    value={invoiceData.fromAddress}
                    onChange={(e) => handleInputChange("fromAddress", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fromGstin">GSTIN</Label>
                  <Input
                    id="fromGstin"
                    value={invoiceData.fromGstin}
                    onChange={(e) => handleInputChange("fromGstin", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={invoiceData.fromEmail}
                      onChange={(e) => handleInputChange("fromEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromPhone">Phone</Label>
                    <Input
                      id="fromPhone"
                      value={invoiceData.fromPhone}
                      onChange={(e) => handleInputChange("fromPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="toName">Client Name</Label>
                  <Input
                    id="toName"
                    value={invoiceData.toName}
                    onChange={(e) => handleInputChange("toName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAddress">Address</Label>
                  <Textarea
                    id="toAddress"
                    value={invoiceData.toAddress}
                    onChange={(e) => handleInputChange("toAddress", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toGstin">GSTIN</Label>
                  <Input
                    id="toGstin"
                    value={invoiceData.toGstin}
                    onChange={(e) => handleInputChange("toGstin", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="toEmail">Email</Label>
                    <Input
                      id="toEmail"
                      type="email"
                      value={invoiceData.toEmail}
                      onChange={(e) => handleInputChange("toEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toPhone">Phone</Label>
                    <Input
                      id="toPhone"
                      value={invoiceData.toPhone}
                      onChange={(e) => handleInputChange("toPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("items")}>Next: Add Items</Button>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Invoice Items</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice #</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceDate">Invoice Date</Label>
                    <Input
                      id="invoiceDate"
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b">
                  <div className="col-span-4">
                    <Label>Description</Label>
                  </div>
                  <div className="col-span-2">
                    <Label>HSN Code</Label>
                  </div>
                  <div className="col-span-1">
                    <Label>Qty</Label>
                  </div>
                  <div className="col-span-1">
                    <Label>Rate</Label>
                  </div>
                  <div className="col-span-2">
                    <Label>Tax</Label>
                  </div>
                  <div className="col-span-1">
                    <Label>Amount</Label>
                  </div>
                  <div className="col-span-1"></div>
                </div>

                {invoiceData.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border-b">
                    <div className="col-span-4">
                      <Input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.hsnCode}
                        onChange={(e) => handleItemChange(item.id, "hsnCode", e.target.value)}
                        placeholder="HSN"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        <Input
                          type="number"
                          value={item.taxRate}
                          onChange={(e) => handleItemChange(item.id, "taxRate", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          max="28"
                          step="0.01"
                          className="w-16"
                        />
                        <Select
                          value={item.taxType}
                          onValueChange={(value) => handleItemChange(item.id, "taxType", value as "CGST/SGST" | "IGST")}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CGST/SGST">CGST/SGST</SelectItem>
                            <SelectItem value="IGST">IGST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="col-span-1 flex items-center">{formatCurrency(item.quantity * item.rate)}</div>
                    <div className="col-span-1 flex justify-center items-center">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="p-3">
                  <Button variant="outline" onClick={addItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" /> Add Item
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Payment terms, delivery information, etc."
                    rows={3}
                  />
                </div>

                <div className="space-y-2 border rounded-md p-4">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax:</span>
                    <span>{formatCurrency(calculateTaxAmount())}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back
              </Button>
              <Button onClick={() => setActiveTab("preview")}>Preview Invoice</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="bg-white border rounded-md p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                      IP
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">InvoicePro</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">{invoiceData.fromName}</p>
                    <p className="whitespace-pre-line">{invoiceData.fromAddress}</p>
                    <p>GSTIN: {invoiceData.fromGstin}</p>
                    <p>Email: {invoiceData.fromEmail}</p>
                    <p>Phone: {invoiceData.fromPhone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="text-2xl font-bold text-emerald-600 mb-2">INVOICE</h2>
                  <p>
                    <span className="font-semibold">Invoice Number:</span> {invoiceData.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {invoiceData.invoiceDate ? format(new Date(invoiceData.invoiceDate), "dd/MM/yyyy") : ""}
                  </p>
                  <p>
                    <span className="font-semibold">Due Date:</span>{" "}
                    {invoiceData.dueDate ? format(new Date(invoiceData.dueDate), "dd/MM/yyyy") : ""}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-sm">
                  <p className="font-semibold">{invoiceData.toName}</p>
                  <p className="whitespace-pre-line">{invoiceData.toAddress}</p>
                  <p>GSTIN: {invoiceData.toGstin}</p>
                  <p>Email: {invoiceData.toEmail}</p>
                  <p>Phone: {invoiceData.toPhone}</p>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gray-50 rounded-t-md border grid grid-cols-12 gap-2 p-3 font-semibold">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">HSN Code</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-1 text-center">Tax</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>

                {invoiceData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-2 p-3 text-sm border-b border-l border-r ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="col-span-4">{item.description}</div>
                    <div className="col-span-2">{item.hsnCode}</div>
                    <div className="col-span-1 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.rate)}</div>
                    <div className="col-span-1 text-center">{item.taxRate}%</div>
                    <div className="col-span-2 text-right">{formatCurrency(item.quantity * item.rate)}</div>
                  </div>
                ))}

                <div className="border-l border-r border-b rounded-b-md p-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(calculateSubtotal())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>{formatCurrency(calculateTaxAmount())}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoiceData.notes && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-2">Notes:</h3>
                  <p className="text-sm whitespace-pre-line">{invoiceData.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("items")}>
                Back
              </Button>
              <Button onClick={generatePDF} className="bg-emerald-600 hover:bg-emerald-700">
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
